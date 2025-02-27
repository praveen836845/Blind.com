#[starknet::contract]
mod BlindPlatform {
    use starknet::storage::StoragePathEntry;
    use core::traits::Into;

    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::contract_address_const;


    #[storage]
    struct Storage {
        // Mapping of post ID to Post struct
        posts: Map<u64, Post>,
        // Total number of posts
        post_count: u64,
        // Mapping of event ID to Event struct
        events: Map<u64, EventData>,
        // Total number of events
        event_count: u64,
        // Mapping of user address to their verification status
        verified_users: Map<ContractAddress, bool>,
        // ERC20 storage
        balances: Map<ContractAddress, u256>,
        allowances: Map<(ContractAddress, ContractAddress), u256>,
        total_supply: u256,
        name: felt252,
        symbol: felt252,
        decimals: u8,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Post {
        id: u64,
        content: felt252,
        timestamp: u64,
        author: ContractAddress,
        // ZK proof of employment/expertise
        proof: felt252,
        // Company identifier (hashed)
        company: felt252,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct EventData {
        id: u64,
        title: felt252,
        description: felt252,
        timestamp: u64,
        host: ContractAddress,
        fee: u256,
        max_attendees: u64,
        current_attendees: u64,
        proof: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PostCreated: PostCreated,
        EventCreated: EventCreated,
        UserVerified: UserVerified,
        // ERC20 events
        Transfer: Transfer,
        Approval: Approval,
    }

    #[derive(Drop, starknet::Event)]
    struct PostCreated {
        post_id: u64,
        author: ContractAddress,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct EventCreated {
        event_id: u64,
        host: ContractAddress,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct UserVerified {
        user: ContractAddress,
        timestamp: u64,
    }

    // ERC20 events
    #[derive(Drop, starknet::Event)]
    struct Transfer {
        from: ContractAddress,
        to: ContractAddress,
        value: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Approval {
        owner: ContractAddress,
        spender: ContractAddress,
        value: u256,
    }

    #[starknet::interface]
    trait IBlindPlatform<TContractState> {
        fn create_post(
            ref self: TContractState, content: felt252, proof: felt252, company: felt252,
        ) -> u64;
        fn create_event(
            ref self: TContractState,
            title: felt252,
            description: felt252,
            proof: felt252,
            fee: u256,
            max_attendees: u64,
        ) -> u64;
        fn verify_user(ref self: TContractState, proof: felt252);
        fn get_post(self: @TContractState, post_id: u64) -> Post;
        fn get_event(self: @TContractState, event_id: u64) -> EventData;
        fn is_user_verified(self: @TContractState, user: ContractAddress) -> bool;
        fn total_supply(self: @TContractState) -> u256;
        fn name(self: @TContractState) -> felt252;
        fn symbol(self: @TContractState) -> felt252;
        fn decimals(self: @TContractState) -> u8;
        // ERC20 functions
        fn initialize(
            ref self: TContractState,
            name: felt252,
            symbol: felt252,
            decimals: u8,
            initial_supply: u256,
            recipient: ContractAddress,
        );
        fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
        fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
        fn transfer_from(
            ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
        ) -> bool;
        fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
        fn allowance(
            self: @TContractState, owner: ContractAddress, spender: ContractAddress,
        ) -> u256;
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.post_count.write(0);
        self.event_count.write(0);
    }

    #[abi(embed_v0)]
    impl BlindPlatformImpl of IBlindPlatform<ContractState> {
        // Create an anonymous post with ZK proof
        fn create_post(
            ref self: ContractState, content: felt252, proof: felt252, company: felt252,
        ) -> u64 {
            let caller = get_caller_address();
            // assert(self.verified_users.read(caller), 'User not verified');

            let post_id = self.post_count.read() + 1;
            let timestamp = starknet::get_block_timestamp();

            // Access the post entry in the map
            let mut post = self.posts.entry(post_id);
            post.id.write(post_id);
            post.content.write(content);
            post.timestamp.write(timestamp);
            post.author.write(caller);
            post.proof.write(proof);
            post.company.write(company);

            // Update the post count
            self.post_count.write(post_id);

            // Emit the PostCreated event
            self.emit(Event::PostCreated(PostCreated { post_id, author: caller, timestamp }));
            post_id
        }

        fn create_event(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            proof: felt252,
            fee: u256,
            max_attendees: u64,
        ) -> u64 {
            let caller = get_caller_address();
            let is_verified = self.verified_users.entry(caller).read();
            assert(is_verified, 'User not verified');
        
            let event_id = self.event_count.read() + 1;
            let timestamp = starknet::get_block_timestamp();
        
            // Access the event entry in the map
            let mut event = self.events.entry(event_id);
            event.id.write(event_id);
            event.title.write(title);
            event.description.write(description);
            event.timestamp.write(timestamp);
            event.host.write(caller);
            event.fee.write(fee);
            event.max_attendees.write(max_attendees);
            event.current_attendees.write(0);
            event.proof.write(proof);
        
            // Update the event count
            self.event_count.write(event_id);
        
            // Emit the EventCreated event
            self.emit(Event::EventCreated(EventCreated { event_id, host: caller, timestamp }));
            event_id
        }

        // Verify a user with their ZK proof
        fn verify_user(ref self: ContractState, proof: felt252) {
            let caller = get_caller_address();
            // TODO: Implement ZK proof verification logic
            let mut user_status = self.verified_users.entry(caller);
            user_status.write(true);

            let timestamp = starknet::get_block_timestamp();
            self.emit(Event::UserVerified(UserVerified { user: caller, timestamp }));
        }

        // View functions
        fn get_post(self: @ContractState, post_id: u64) -> Post {
            self.posts.entry(post_id).read()
        }

        fn get_event(self: @ContractState, event_id: u64) -> EventData {
            self.events.entry(event_id).read()
        }

        fn is_user_verified(self: @ContractState, user: ContractAddress) -> bool {
            self.verified_users.entry(user).read()
        }

        // ERC20 functions
        fn initialize(
            ref self: ContractState,
            name: felt252,
            symbol: felt252,
            decimals: u8,
            initial_supply: u256,
            recipient: ContractAddress,
        ) {
            self.name.write(name);
            self.symbol.write(symbol);
            self.decimals.write(decimals);
            self.total_supply.write(initial_supply);
            self.balances.entry(recipient).write(initial_supply);
            self.emit(Event::Transfer(Transfer { from: contract_address_const::<0>(), to: recipient, value: initial_supply }));
        }

        fn transfer(ref self: ContractState, recipient: ContractAddress, amount: u256) -> bool {
            let sender = get_caller_address();
            let sender_balance = self.balances.entry(sender).read();
            assert(sender_balance >= amount, 'Insufficient balance');

            self.balances.entry(sender).write(sender_balance - amount);
            let recipient_balance = self.balances.entry(recipient).read();
            self.balances.entry(recipient).write(recipient_balance + amount);

            self.emit(Event::Transfer(Transfer { from: sender, to: recipient, value: amount }));
            true
        }

        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
            let owner = get_caller_address();
            self.allowances.entry((owner, spender)).write(amount);
            self.emit(Event::Approval(Approval { owner, spender, value: amount }));
            true
        }

        fn transfer_from(
            ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
        ) -> bool {
            let spender = get_caller_address();
            let allowance = self.allowances.entry((sender, spender)).read();
            assert(allowance >= amount, 'Insufficient allowance');

            let sender_balance = self.balances.entry(sender).read();
            assert(sender_balance >= amount, 'Insufficient balance');

            self.allowances.entry((sender, spender)).write(allowance - amount);
            self.balances.entry(sender).write(sender_balance - amount);
            let recipient_balance = self.balances.entry(recipient).read();
            self.balances.entry(recipient).write(recipient_balance + amount);

            self.emit(Event::Transfer(Transfer { from: sender, to: recipient, value: amount }));
            true
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.entry(account).read()
        }

        fn allowance(
            self: @ContractState, owner: ContractAddress, spender: ContractAddress,
        ) -> u256 {
            self.allowances.entry((owner, spender)).read()
        }

        fn total_supply(self: @ContractState) -> u256 {
            self.total_supply.read()
        }

        fn name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn symbol(self: @ContractState) -> felt252 {
            self.symbol.read()
        }

        fn decimals(self: @ContractState) -> u8 {
            self.decimals.read()
        }
    }
}
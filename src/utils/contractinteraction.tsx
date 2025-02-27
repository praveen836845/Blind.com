import { RpcProvider, Contract } from 'starknet';

// Replace with your contract address
const CONTRACT_ADDRESS = '0x06a863dc29bc031a5e33559f97570f4c99bdc9c869b6888751ae3d8accb6d24a';

// Connect to Madara Devnet
const provider = new RpcProvider({ nodeUrl: 'http://localhost:9944' });

// Fetch the contract ABI dynamically
export const fetchContractABI = async () => {
  try {
    const compressedContract = await provider.getClassAt(CONTRACT_ADDRESS);
    const abi = compressedContract.abi;
    return abi;
  } catch (error) {
    console.error('Error fetching contract ABI:', error);
    return null;
  }
};

// Initialize the contract
export const initializeContract = async () => {
  const abi = await fetchContractABI();
  if (abi) {
    return new Contract(abi, CONTRACT_ADDRESS, provider);
  }
  return null;
};

// Fetch a post by ID with parseResponse & formatResponse
export const fetchPosts = async (contract) => {
    try {
      const formatResponse = {
        author: 'string',
        company: 'string',
        content: 'string',
        id: 'number',
        proof: 'string',
        timestamp: 'number',
      };
  
      let posts = [];
      for (let postId = 12; postId <= 15; postId++) {
        const post = await contract.get_post(postId, {
          parseRequest: true,
          parseResponse: true,
          formatResponse,
        });
        posts.push(post);
      }
  
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };
  

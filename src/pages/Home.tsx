
import { motion } from 'framer-motion';
import { MessageSquare, Shield, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Empower Change</span>
              <br />
              <span className="text-gray-800">Through Feedback</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of professionals shaping workplace culture through anonymous, honest feedback.
            </p>
            <Link to="/create-review">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Share Your Experience</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="floating-card bg-white rounded-2xl p-8 card-shadow">
              <CreateReviewForm />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Why Choose Blind.com?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useFormik } from "formik";
import * as z from "zod";


const reviewSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  department: z.string().min(1, "Department is required"),
  review: z.string().min(10, "Review must be at least 10 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(1, "Please provide a rating"),
});

const CreateReviewForm = () => {
  const formik = useFormik({
    initialValues: {
      company: "",
      department: "",
      review: "",
      description: "",
      rating: 0,
    },
    validate: (values) => {
      const parsed = reviewSchema.safeParse(values);
      if (!parsed.success) {
        return parsed.error.flatten().fieldErrors;
      }
    },
    onSubmit: (values) => {
      console.log("Submitted Data:", values);
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Share Your Experience</h3>

      {/* Company Input */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Company</label>
        <input
          type="text"
          name="company"
          className={`input-field w-full border ${formik.errors.company ? "border-red-500" : "border-gray-300"}`}
          placeholder="Where do you work?"
          onChange={formik.handleChange}
          value={formik.values.company}
        />
        {formik.errors.company && <p className="text-red-500">{formik.errors.company}</p>}
      </div>

      {/* Department Dropdown */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Department</label>
        <select
          name="department"
          className={`input-field w-full border ${formik.errors.department ? "border-red-500" : "border-gray-300"}`}
          onChange={formik.handleChange}
          value={formik.values.department}
        >
          <option value="">Select your department</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>
        {formik.errors.department && <p className="text-red-500">{formik.errors.department}</p>}
      </div>

      {/* Review Textarea */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Your Review</label>
        <textarea
          name="review"
          className={`input-field w-full resize-none border ${formik.errors.review ? "border-red-500" : "border-gray-300"}`}
          rows={4}
          placeholder="Share your thoughts..."
          onChange={formik.handleChange}
          value={formik.values.review}
        />
        {formik.errors.review && <p className="text-red-500">{formik.errors.review}</p>}
      </div>

      {/* Description Textarea */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Description</label>
        <textarea
          name="description"
          className={`input-field w-full resize-none border ${formik.errors.description ? "border-red-500" : "border-gray-300"}`}
          rows={4}
          placeholder="Provide additional details..."
          onChange={formik.handleChange}
          value={formik.values.description}
        />
        {formik.errors.description && <p className="text-red-500">{formik.errors.description}</p>}
      </div>

      {/* Star Rating */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${formik.values.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              onClick={() => formik.setFieldValue("rating", star)}
            />
          ))}
        </div>
      </div>
      {formik.errors.rating && <p className="text-red-500">{formik.errors.rating}</p>}

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-primary"
      >
        Submit Review
      </motion.button>
    </form>
  );
};

const features = [
  {
    icon: Shield,
    title: "100% Anonymous",
    description: "Your identity is always protected. Share freely without fear of repercussions."
  },
  {
    icon: Users,
    title: "Verified Reviews",
    description: "All reviews come from verified professionals in top companies."
  },
  {
    icon: MessageSquare,
    title: "Real Impact",
    description: "Your feedback helps shape better workplaces for everyone."
  }
];

export default Home;
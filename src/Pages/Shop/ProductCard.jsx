import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa"; // Import icons

const ProductCard = ({ product }) => {
    const { _id, productName, images, price, discountedPrice } = product;

    // Calculate discount percentage
    const discountPercentage = price > 0 && discountedPrice < price
        ? Math.round(((price - discountedPrice) / price) * 100)
        : 0;

    return (
        <Link to={`/product/${_id}`} className="w-full max-w-[220px]">
            <div className="flex flex-col h-full p-4 shadow-lg hover:shadow-xl transition duration-300 bg-white border border-gray-200 hover:border-gray-300 relative">
                
                {/* Product Image with Discount Badge */}
                <div className="relative w-full">
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg z-10">
                            {discountPercentage}% OFF
                        </div>
                    )}
                    <img
                        src={images[0]}
                        alt={productName}
                        className="w-full h-auto aspect-[4/3] object-cover rounded-md"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow justify-between mt-2">
                    <h2 className="text-sm font-semibold text-left text-gray-800">{productName}</h2>

                    {/* Price Section */}
                    <p className="text-gray-600 text-left mt-2 text-xs">
                        {discountedPrice < price ? (
                            <>
                                <span className="line-through text-red-500">${price}</span>
                                <span className="text-[#2DAA9E] font-semibold ml-1">${discountedPrice}</span>
                            </>
                        ) : (
                            <span className="text-black font-semibold">${price}</span>
                        )}
                    </p>
                </div>

                {/* Icons: Favorite & Add to Cart */}
                <div className="absolute bottom-3 right-3 flex gap-3">
                    <button className="text-gray-600 hover:text-red-500 transition">
                        <FaHeart size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-[#2DAA9E] transition">
                        <FaShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;

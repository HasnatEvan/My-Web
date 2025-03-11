import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import bkash from '../../assets/logo/bkash.jpeg'
import { FiCopy } from 'react-icons/fi';

const OrderModel = ({ isOpen, setIsOpen, product }) => {

    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    if (!product) return null;

    const { productName, discountedPrice, price, images, discountPercentage,
        outOfChittagongDeliveryPrice,insideChittagongDeliveryPrice,bkashNumber, quantity, sizes, colors, _id } = product;
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");
    const [division, setDivision] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState(""); // নতুন স্টেট Upazila/Thana
    const [address, setAddress] = useState("");
    const [orderNote, setOrderNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState("");


    // ডেলিভারি দাম বিভাগ অনুযায়ী
    const insideChittagongDeliveryPrices =insideChittagongDeliveryPrice ;
    const outsideChittagongDeliveryPrice = outOfChittagongDeliveryPrice;
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    // পরিমাণ বৃদ্ধি ফাংশন
    const increaseQuantity = () => {
        if (selectedQuantity < quantity) {
            setSelectedQuantity(selectedQuantity + 1);
        }
    };

    // পরিমাণ কমানো ফাংশন
    const decreaseQuantity = () => {
        if (selectedQuantity > 1) {
            setSelectedQuantity(selectedQuantity - 1);
        }
    };

    // উপলব্ধ বিভাগ এবং সংশ্লিষ্ট জেলা
    const divisions = [
        { name: "চট্টগ্রাম", districts: ["চট্টগ্রাম", "কক্সবাজার", "ফেনী", "বান্দরবান", "লক্ষ্মীপুর", "নোয়াখালী", "চাঁদপুর", "মাইজদী"] },
        { name: "রাজশাহী", districts: ["রাজশাহী", "নাটোর", "চাঁপাইনবাবগঞ্জ", "বগুড়া", "জয়পুরহাট", "সিরাজগঞ্জ", "পবা"] },
        { name: "খুলনা", districts: ["খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "নড়াইল", "মাগুরা", "কুষ্টিয়া"] },
        { name: "বরিশাল", districts: ["বরিশাল", "পটুয়াখালী", "ভোলা", "ঝালকাঠি", "বরগুনা"] },
        { name: "সিলেট", districts: ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "ব্রাহ্মণবাড়িয়া"] },
        { name: "ঢাকা", districts: ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "মানিকগঞ্জ", "মাদারীপুর", "রাজবাড়ী", "শেরপুর", "টাঙ্গাইল"] },
        { name: "রংপুর", districts: ["রংপুর", "দিনাজপুর", "কুড়িগ্রাম", "গাইবান্ধা", "ঠাকুরগাঁও", "পঞ্চগড়", "নীলফামারী"] },
        { name: "ময়মনসিংহ", districts: ["ময়মনসিংহ", "নেত্রকোনা", "জামালপুর", "শেরপুর"] }
    ];

    // বিভাগ পরিবর্তন এবং জেলা সেট করা
    const handleDivisionChange = (e) => {
        const selectedDivision = e.target.value;
        setDivision(selectedDivision);
        const selectedDivisionData = divisions.find(div => div.name === selectedDivision);
        if (selectedDivisionData) {
            setDistrict(selectedDivisionData.districts[0]);
            setDeliveryPrice(selectedDivision === "চট্টগ্রাম" ? insideChittagongDeliveryPrices : outsideChittagongDeliveryPrice);
        }
    };

    // মোট মূল্য হিসাব করা (পণ্যের দাম + ডেলিভারি দাম)
    const totalPrice = discountedPrice * selectedQuantity ;
    const productPrice=discountedPrice * selectedQuantity;
    const SinglePrice =discountedPrice

    const handleConfirmOrder = async () => {
        setLoading(true);

        if (!selectedColor || !selectedSize) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'ভ্যালিডেশন ব্যর্থ!',
                text: 'দয়া করে রং এবং আকার নির্বাচন করুন।',
            });
            return; // Validation ফেইল হলে ফাংশন থামিয়ে দাও
        }

        if (!/^\d{11}$/.test(phoneNumber)) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'অবৈধ ফোন নম্বর',
                text: 'দয়া করে ১১ ডিজিটের সঠিক ফোন নম্বর প্রবেশ করুন।',
            });
            return;
        }

        if (!division || !district || !upazila.trim() || address.length < 10) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'অবৈধ ঠিকানা',
                text: 'দয়া করে আপনার ঠিকানা পূর্ণভাবে পূর্ণ করুন।',
            });
            return;
        }
        if (!transactionId || transactionId.length !== 10) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'অবৈধ ট্রানজেকশন আইডি',
                text: 'দয়া করে ১০ অক্ষরের সঠিক ট্রানজেকশন আইডি প্রবেশ করুন।',
            });
            return; // Stop execution if validation fails
        }

        const updatedOrderInfo = {
            customer: {
                name: user?.displayName,
                email: user?.email,
                image: user?.photoURL,
            },
            productId: _id,
            quantity: selectedQuantity,
            size: selectedSize,
            color: selectedColor,
            disCount: discountPercentage || 'কোনো ডিসকাউন্ট নেই',
            totalPrice: totalPrice,
            price: price,
            SinglePrice,
            productPrice,
            phoneNumber,
            division,
            district,
            upazila,
            address,
            orderNote,
            deliveryPrice,
            transactionId,
            status: "pending", // প্রাথমিক অবস্থায়: pending
        };

        try {
            const response = await axiosSecure.post("/orders", updatedOrderInfo);
            if (response.data.insertedId) {
                const updateStock = await axiosSecure.patch(`/products/quantity/${_id}`, {
                    quantityToUpdate: selectedQuantity,
                    status: "decrease",
                });

                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'অর্ডার নিশ্চিত করা হয়েছে!',
                    text: 'আপনার অর্ডার সফলভাবে স্থাপন করা হয়েছে।',
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'অর্ডার ব্যর্থ',
                text: 'অর্ডার নিশ্চিত করতে কিছু ভুল হয়েছে।',
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex -mt-26 items-center justify-center z-50">
        <div className="fixed inset-0 bg-blur bg-opacity-30"></div>
    
        <DialogPanel className="bg-white text-black rounded-lg p-6 w-[600px] shadow-lg z-50 relative overflow-y-auto max-h-[98vh]">
            <DialogTitle className="text-lg font-semibold text-gray-800 mt-10 text-center">আপনার অর্ডার নিশ্চিত করুন</DialogTitle>
    
            {/* পণ্যের তথ্য */}
            <div className="flex items-center gap-4 mt-3">
                <img src={images?.[0]} alt={productName} className="w-16 h-16 object-cover rounded-md border" />
                <div>
                    <h3 className="text-md font-medium">{productName}</h3>
                    <p className="text-red-500 font-semibold text-lg">৳ {discountedPrice}</p>
                    {discountPercentage > 0 && (
                        <p className="line-through text-gray-500 text-sm">৳ {price}</p>
                    )}
                </div>
            </div>
    
            {/* পরিমাণ সিলেক্টর */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">পরিমাণ নির্বাচন করুন:</h3>
                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={decreaseQuantity}
                        className="px-3 py-2 rounded-lg transition disabled:bg-gray-200"
                        disabled={selectedQuantity <= 1}
                    >
                        -
                    </button>
    
                    <span className="text-lg font-semibold">{selectedQuantity}</span>
    
                    <button
                        onClick={increaseQuantity}
                        className="px-3 py-2 rounded-lg transition disabled:bg-gray-200"
                        disabled={selectedQuantity >= quantity}
                    >
                        +
                    </button>
                </div>
            </div>
    
            {/* আকার সিলেক্টর */}
            {sizes?.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">আকার নির্বাচন করুন:</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {sizes.map((size, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 border rounded-lg transition ${selectedSize === size ? "bg-[#2DAA9E] text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
    
            {/* রং সিলেক্টর */}
            {colors?.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">রং নির্বাচন করুন:</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {colors.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 border rounded-lg transition ${selectedColor === color ? "bg-[#2DAA9E] text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                style={{ backgroundColor: selectedColor === color ? "#2DAA9E" : "" }}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}
    
            {/* ফোন নম্বর */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">ফোন নম্বর</label>
                <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                    placeholder="আপনার ফোন নম্বর লিখুন"
                />
            </div>
    
            {/* বিভাগ সিলেক্টর */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">বিভাগ</label>
                <select
                    value={division}
                    onChange={handleDivisionChange}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {divisions.map((div, index) => (
                        <option key={index} value={div.name}>{div.name}</option>
                    ))}
                </select>
            </div>
    
            {/* জেলা সিলেক্টর */}
            {division && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">জেলা</label>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                    >
                        {divisions.find(div => div.name === division)?.districts.map((dist, index) => (
                            <option key={index} value={dist}>{dist}</option>
                        ))}
                    </select>
                </div>
            )}
    
            {/* Upazila/Thana সিলেক্টর */}
            {district && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Upazila/Thana</label>
                    <input
                        type="text"
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                        placeholder="Upazila/Thana লিখুন"
                    />
                </div>
            )}
    
            {/* ঠিকানা */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">পূর্ণ ঠিকানা</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                    placeholder="আপনার পূর্ণ ঠিকানা লিখুন (থানা সহ)"
                />
            </div>
    
            {/* অর্ডার নোট (ঐচ্ছিক) */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">অর্ডার নোট (ঐচ্ছিক)</label>
                <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                    placeholder="যে কোনো নোট যোগ করুন (ঐচ্ছিক)"
                />
            </div>
    
            {/* Bkash number with copy button */}
            <h2 className="flex items-center gap-2 flex-wrap">
                <img src={bkash} alt="Bkash" className="w-8 h-8" />
                <span className="text-sm">{bkashNumber}</span>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(bkashNumber);
                        Swal.fire({
                            icon: 'success',
                            title: 'Copied!',
                            text: 'Bkash number copied to clipboard!',
                        });
                    }}
                    className="text-sm text-blue-500 underline mt-1 sm:mt-0 flex items-center gap-1"
                >
                    <FiCopy />
                </button>
            </h2>
    
            {/* Transaction ID */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                    placeholder="আপনার ট্রাঞ্জেকশন আইডি লিখুন"
                />
            </div>
    
            {/* মোট মূল্য */}
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">পণ্যের মূল্য: ৳ {discountedPrice * selectedQuantity}</p>
                <p className="text-sm font-medium text-gray-700">ডেলিভারি চার্জ: ৳ {deliveryPrice}</p>
                <p className="text-sm font-medium text-gray-700">মোট মূল্য: ৳ {totalPrice}</p>
            </div>
    
            <p><span className="text-red-500">Important Note:</span> অর্ডার কনফার্ম করার জন্য ডেলিভারি চার্জ ৳ <span className="text-[#2DAA9E]">{deliveryPrice}</span> অগ্রিম পরিশোধ করতে হবে।</p>
    
            {/* বাটন */}
            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                    বাতিল
                </button>
                <button
                    onClick={handleConfirmOrder}
                    className="bg-[#2DAA9E] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                    disabled={loading} // লোডিং চলাকালীন বাটন ডিজেবল থাকবে
                >
                    {loading ? (
                        <span className="loading loading-infinity loading-xl"></span>
                    ) : (
                        "অর্ডার নিশ্চিত করুন"
                    )}
                </button>
            </div>
        </DialogPanel>
    </Dialog>
    


    );
};

export default OrderModel;

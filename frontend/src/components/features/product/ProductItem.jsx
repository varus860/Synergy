import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItem } from '../../../store/features/cart'
import { useDebug } from '../../../context/DebugContext'
import { API_BASE_URL, API_URL } from "../../../services/constants";
import noImagePlaceholder from "../../../assets/images/no-image.svg";
import StockStatusIndicator from '../../ui/StockStatusIndicator'

const ProductItem = (props) => {
    const { print } = useDebug();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();



        try {
            print(`Quick adding product ${props.id} to cart`, 'info');
            setAdding(true);
            dispatch(addItem({
                product: {
                    productId: props.id,
                    name: props.name,
                    price: props.price,
                    thumbnail_url: props.thumbnail
                },
                quantity: 1
            }));
            print('Product quick-added to cart successfully', 'success');
        } catch (error) {
            print('Quick add failed:', 'error');
            print(error, 'error');
            console.error("Quick add failed:", error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <Link
            to={`/details/${props.id}`}
            className="bg-white border border-gray-100 rounded-[8px] overflow-hidden transition-all duration-250 cursor-pointer group hover:border-trust-blue/30 block relative"
        >
            <div className="aspect-square w-full overflow-hidden bg-gray-50">
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={props.thumbnail
                        ? `${API_BASE_URL}${API_URL.IMAGE_CONSTANT}${props.thumbnail}`
                        : noImagePlaceholder}
                    alt={props.name}
                />
            </div>
            <div className="p-6 space-y-3">
                <h3 className="text-[1.1rem] font-bold text-text-primary line-clamp-2 leading-tight">
                    {props.name}
                </h3>
                <p className="text-[0.94rem] text-text-secondary line-clamp-2 leading-[1.6]">
                    {props.desc}
                </p>
                <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[1.28rem] font-bold text-trust-blue">
                            {props.price.toFixed(2)} Birr
                        </span>
                        <StockStatusIndicator quantity={props.stockQuantity} size="sm" />
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="w-8 h-8 rounded-full bg-trust-blue text-white flex items-center justify-center hover:bg-trust-blue-dark transition-all duration-250 active:scale-90 disabled:bg-gray-400 group-hover:shadow-sm"
                        title="Quick Add to Cart"
                    >
                        {adding ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    )
}
export default ProductItem
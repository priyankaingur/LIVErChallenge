import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            const db = getFirestore();
            const productRef = doc(db, 'products', productId);
            const docSnap = await getDoc(productRef);
            if (docSnap.exists()) {
                setProduct(docSnap.data());
            }
        };

        fetchProductDetails();
    }, [productId]);
    console.log(productId)

    return (
        <div>
            {product ? (
                <div>
                    <h2>{productId}</h2>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>
    );
}

export default ProductDetail;

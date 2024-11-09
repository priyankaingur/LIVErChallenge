import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {auth, signOut} from "../firebase";

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
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userToken');
            localStorage.removeItem('userUid');
            console.log('User logged out');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };
    return (
        <div>
            {product ? (

                <div>
                    <button onClick={handleLogout} style={{marginTop: '10px'}}>
                        Logout
                    </button>
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

import React from "react";
import { FiX } from "react-icons/fi";

import {
    Overlay,
    ModalBox,
    ModalHeader,
    ModalTitle,
    CloseButton,
    ModalBody,
    InfoRow,
    InfoLabel,
    InfoValue,
} from "./ProductInfoModal.styles";

const fields = [
    { key: "product_name", label: "Product Name" },
    { key: "product_type", label: "Type" },
    { key: "category", label: "Category" },
    { key: "supplier", label: "Supplier" },
    { key: "unit", label: "Unit" },
    { key: "brand", label: "HSN/SAC" },
    { key: "warehouse_name", label: "Warehouse" },
    { key: "cost_price", label: "Cost Price" },
    { key: "selling_price", label: "Selling Price" },
    { key: "current_stock", label: "Current Stock" },
    { key: "stock_status", label: "Stock Status" },
];

const ProductInfoModal = ({ isOpen, product, onClose }) => {
    if (!isOpen || !product) return null;

    return (
        <Overlay onClick={onClose}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Product Info</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <FiX size={18} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    {fields.map((field) => (
                        <InfoRow key={field.key}>
                            <InfoLabel>{field.label}</InfoLabel>
                            <InfoValue>
                                {product[field.key] ?? "-"}
                            </InfoValue>
                        </InfoRow>
                    ))}
                </ModalBody>
            </ModalBox>
        </Overlay>
    );
};

export default ProductInfoModal;
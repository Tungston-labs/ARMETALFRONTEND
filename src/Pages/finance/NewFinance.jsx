import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Form,
  FormRow,
  Input,
  TextArea,
  ButtonGroup,
  Button,
  Label,
  HeaderLeft,
  Select,
} from "./NewFinance.Styles";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import {
  createFinanceCategory,
  fetchFinanceCategoryList,
} from "../../Redux/financeThunks";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const PAYMENT_TYPE_OPTIONS = [
  { label: "Income", value: "IN" },
  { label: "Expense", value: "OUT" },
];

const initialFormState = {
  category: "",
  date: getTodayDate(),
  paymentType: "",
  amount1: "",
  note: "",
};

const FinanceModal = ({ isOpen, onClose, onSave }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState([]);


 useEffect(() => {
  const loadCategories = async () => {
    if (!formData.paymentType) {
      setCategories([]);  
      return;
    }

    const res = await dispatch(
      fetchFinanceCategoryList(formData.paymentType)
    );

    if (res.meta.requestStatus === "fulfilled") {
      setCategories(res.payload.results);
    }
  };

  loadCategories();
}, [formData.paymentType, dispatch]);
  if (!isOpen) return null;


  const resetForm = () => {
    setFormData({
      ...initialFormState,
      date: getTodayDate(),
    });
    setCustomCategory("");
    setErrors({});
  };

 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    if (name === "paymentType") {
      return {
        ...prev,
        paymentType: value,
        category: "",  
      };
    }
  return { ...prev, [name]: value };
  });
  setErrors((prev) => ({ ...prev, [name]: "" }));
};

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.paymentType)
      newErrors.paymentType = "Payment type is required";
    if (!formData.amount1)
      newErrors.amount1 = "Amount is required";
    else if (Number(formData.amount1) <= 0)
      newErrors.amount1 = "Amount must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let finalCategory = formData.category;
    if (formData.category === "ADD_NEW") {
      if (!customCategory.trim()) {
        setErrors({ category: "Enter category name" });
        return;
      }

      const res = await dispatch(
        createFinanceCategory({
          name: customCategory.toLowerCase(), 
          payment_type: formData.paymentType,
        })
      );

      if (res.meta.requestStatus === "fulfilled") {
        finalCategory = res.payload.id;
        const refresh = await dispatch(
          fetchFinanceCategoryList(formData.paymentType)
        );
        if (refresh.meta.requestStatus === "fulfilled") {
          setCategories(refresh.payload.results);
        }
      } else {
        return;
      }
    }

    await onSave({
      category: finalCategory,
      paymentType: formData.paymentType,
      amount1: formData.amount1,
      date: formData.date,
      note: formData.note,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
             <HeaderLeft>
          <ModalTitle>New Finance Entry</ModalTitle>
      </HeaderLeft>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <div>
              <Label>Payment Type *</Label>
              <Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="">Select Payment Type</option>
                {PAYMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors.paymentType && (
                <p className="error">{errors.paymentType}</p>
              )}
            </div>

            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </FormRow>

          <FormRow>
            <div>
              <Label>Category *</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="ADD_NEW">+ Add New Category</option>
              </Select>
              {errors.category && <p className="error">{errors.category}</p>}
              {formData.category === "ADD_NEW" && (
                <Input
                  type="text"
                  placeholder="Enter new category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  style={{ marginTop: "8px" }}
                />
              )}
            </div>
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                name="amount1"
                value={formData.amount1}
                onChange={handleChange}
              />
              {errors.amount1 && (
                <p className="error">{errors.amount1}</p>
              )}
            </div>
          </FormRow>
          <div>
            <Label>Note</Label>
            <TextArea
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>
          <ButtonGroup>
            <Button type="button" variant="cancel" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="submit">
              Submit
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default FinanceModal;
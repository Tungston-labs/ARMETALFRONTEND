// // import React, { useEffect, useState } from "react";
// // import { FiSave } from "react-icons/fi";

// // import {
// //   Overlay,
// //   ModalContainer,
// //   Header,
// //   Title,
// //   Description,
// //   Form,
// //   FormGrid,
// //   Field,
// //   Label,
// //   Input,
// //   Select,
// //   ButtonGroup,
// //   CancelButton,
// //   SaveButton,
// // } from "./WarehouseModal.styles";

// // const DEFAULT_FORM_DATA = {
// //   warehouseName: "",
// //   warehouseCode: "",
// //   warehouseType: "",
// //   manager: "",
// //   status: "",
// //   operatingSince: "",
// //   country: "",
// //   city: "",
// //   addressLine1: "",
// //   addressLine2: "",
// //   postalCode: "",
// //   phoneNumber: "",
// //   email: "",
// //   storageCapacity: "",
// //   notes: "",
// // };

// // const WarehouseModal = ({ isOpen, onClose, onSubmit, initialData }) => {
// //   const [formData, setFormData] = useState({
// //     ...DEFAULT_FORM_DATA,
// //     ...(initialData || {}),
// //   });

// //   /* =======================================================
// //      RESET FORM WHEN MODAL OPENS
// //   ======================================================= */

// //   useEffect(() => {
// //     if (!isOpen) {
// //       return;
// //     }

// //     setFormData({
// //       ...DEFAULT_FORM_DATA,
// //       ...(initialData || {}),
// //     });
// //   }, [isOpen, initialData]);

// //   /* =======================================================
// //      ESCAPE KEY
// //   ======================================================= */

// //   useEffect(() => {
// //     if (!isOpen) {
// //       return undefined;
// //     }

// //     const handleEscape = (event) => {
// //       if (event.key === "Escape") {
// //         onClose();
// //       }
// //     };

// //     document.addEventListener("keydown", handleEscape);

// //     return () => {
// //       document.removeEventListener("keydown", handleEscape);
// //     };
// //   }, [isOpen, onClose]);

// //   if (!isOpen) {
// //     return null;
// //   }

// //   /* =======================================================
// //      INPUT CHANGE
// //   ======================================================= */

// //   const handleChange = (event) => {
// //     const { name, value } = event.target;

// //     setFormData((previous) => ({
// //       ...previous,
// //       [name]: value,
// //     }));
// //   };

// //   /* =======================================================
// //      SUBMIT
// //   ======================================================= */

// //   const handleSubmit = (event) => {
// //     event.preventDefault();

// //     if (!onSubmit) {
// //       return;
// //     }

// //     onSubmit(formData);
// //   };

// //   /* =======================================================
// //      OVERLAY
// //   ======================================================= */

// //   const handleOverlayClick = (event) => {
// //     if (event.target === event.currentTarget) {
// //       onClose();
// //     }
// //   };

// //   return (
// //     <Overlay onClick={handleOverlayClick}>
// //       <ModalContainer
// //         role="dialog"
// //         aria-modal="true"
// //         aria-labelledby="warehouse-modal-title"
// //       >
// //         <Header>
// //           <Title id="warehouse-modal-title">Add New Warehouse</Title>

// //           <Description>
// //             Create a new warehouse to manage inventory and stock operations.
// //           </Description>
// //         </Header>

// //         <Form onSubmit={handleSubmit}>
// //           <FormGrid>
// //             {/* WAREHOUSE NAME */}

// //             <Field>
// //               <Label htmlFor="warehouseName">WAREHOUSE NAME</Label>

// //               <Input
// //                 id="warehouseName"
// //                 name="warehouseName"
// //                 value={formData.warehouseName}
// //                 onChange={handleChange}
// //                 placeholder="Enter Warehouse Name"
// //                 required
// //               />
// //             </Field>

// //             {/* WAREHOUSE CODE */}

// //             <Field>
// //               <Label htmlFor="warehouseCode">WAREHOUSE CODE</Label>

// //               <Input
// //                 id="warehouseCode"
// //                 name="warehouseCode"
// //                 value={formData.warehouseCode}
// //                 onChange={handleChange}
// //                 placeholder="Enter Warehouse Code"
// //               />
// //             </Field>

// //             {/* WAREHOUSE TYPE */}

// //             <Field>
// //               <Label htmlFor="warehouseType">WAREHOUSE TYPE</Label>

// //               <Select
// //                 id="warehouseType"
// //                 name="warehouseType"
// //                 value={formData.warehouseType}
// //                 onChange={handleChange}
// //               >
// //                 <option value="">Select Type</option>

// //                 <option value="main">Main</option>

// //                 <option value="regional">Regional</option>

// //                 <option value="distribution">Distribution</option>
// //               </Select>
// //             </Field>

// //             {/* MANAGER */}

// //             <Field>
// //               <Label htmlFor="manager">MANAGER</Label>

// //               <Input
// //                 id="manager"
// //                 name="manager"
// //                 value={formData.manager}
// //                 onChange={handleChange}
// //                 placeholder="Enter Manager Name"
// //                 type="text"
// //                 autoComplete="off"
// //               />
// //             </Field>

// //             {/* STATUS */}

// //             <Field>
// //               <Label htmlFor="status">STATUS</Label>

// //               <Select
// //                 id="status"
// //                 name="status"
// //                 value={formData.status}
// //                 onChange={handleChange}
// //               >
// //                 <option value="">Select Status</option>

// //                 <option value="active">Active</option>

// //                 <option value="inactive">Inactive</option>
// //               </Select>
// //             </Field>

// //             {/* OPERATING SINCE */}

// //             <Field>
// //               <Label htmlFor="operatingSince">OPERATING SINCE</Label>

// //               <Input
// //                 id="operatingSince"
// //                 name="operatingSince"
// //                 type="date"
// //                 value={formData.operatingSince}
// //                 onChange={handleChange}
// //               />
// //             </Field>

// //             {/* COUNTRY */}

// //             <Field>
// //               <Label htmlFor="country">COUNTRY</Label>

// //               <Input
// //                 id="country"
// //                 name="country"
// //                 value={formData.country}
// //                 onChange={handleChange}
// //                 placeholder="Enter Country"
// //               />
// //             </Field>

// //             {/* CITY */}

// //             <Field>
// //               <Label htmlFor="city">CITY</Label>

// //               <Input
// //                 id="city"
// //                 name="city"
// //                 value={formData.city}
// //                 onChange={handleChange}
// //                 placeholder="Enter City"
// //               />
// //             </Field>

// //             {/* ADDRESS LINE 1 */}

// //             <Field>
// //               <Label htmlFor="addressLine1">ADDRESS LINE 1</Label>

// //               <Input
// //                 id="addressLine1"
// //                 name="addressLine1"
// //                 value={formData.addressLine1}
// //                 onChange={handleChange}
// //                 placeholder="Enter Address"
// //               />
// //             </Field>

// //             {/* ADDRESS LINE 2 */}

// //             <Field>
// //               <Label htmlFor="addressLine2">ADDRESS LINE 2</Label>

// //               <Input
// //                 id="addressLine2"
// //                 name="addressLine2"
// //                 value={formData.addressLine2}
// //                 onChange={handleChange}
// //                 placeholder="Enter Address"
// //               />
// //             </Field>

// //             {/* POSTAL CODE */}

// //             <Field>
// //               <Label htmlFor="postalCode">POSTAL CODE</Label>

// //               <Input
// //                 id="postalCode"
// //                 name="postalCode"
// //                 value={formData.postalCode}
// //                 onChange={handleChange}
// //                 placeholder="Enter Postal Code"
// //               />
// //             </Field>

// //             {/* PHONE */}

// //             <Field>
// //               <Label htmlFor="phoneNumber">PHONE NUMBER</Label>

// //               <Input
// //                 id="phoneNumber"
// //                 name="phoneNumber"
// //                 type="tel"
// //                 value={formData.phoneNumber}
// //                 onChange={handleChange}
// //                 placeholder="Enter Phone Number"
// //               />
// //             </Field>

// //             {/* EMAIL */}

// //             <Field>
// //               <Label htmlFor="email">EMAIL</Label>

// //               <Input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 placeholder="Enter Email"
// //               />
// //             </Field>

// //             {/* STORAGE CAPACITY */}

// //             <Field>
// //               <Label htmlFor="storageCapacity">STORAGE CAPACITY</Label>

// //               <Input
// //                 id="storageCapacity"
// //                 name="storageCapacity"
// //                 value={formData.storageCapacity}
// //                 onChange={handleChange}
// //                 placeholder="Enter Storage Capacity"
// //               />
// //             </Field>

// //             {/* NOTES */}

// //             <Field>
// //               <Label htmlFor="notes">NOTES</Label>

// //               <Input
// //                 id="notes"
// //                 name="notes"
// //                 value={formData.notes}
// //                 onChange={handleChange}
// //                 placeholder="Enter Notes"
// //               />
// //             </Field>
// //           </FormGrid>

// //           <ButtonGroup>
// //             <CancelButton type="button" onClick={onClose}>
// //               CANCEL
// //             </CancelButton>

// //             <SaveButton type="submit">
// //               <FiSave size={14} />
// //               SAVE WAREHOUSE
// //             </SaveButton>
// //           </ButtonGroup>
// //         </Form>
// //       </ModalContainer>
// //     </Overlay>
// //   );
// // };

// // export default WarehouseModal;
// import React, { useEffect, useState } from "react";
// import { FiSave } from "react-icons/fi";

// import {
//   Overlay,
//   ModalContainer,
//   Header,
//   Title,
//   Description,
//   Form,
//   FormGrid,
//   Field,
//   Label,
//   Input,
//   Select,
//   ButtonGroup,
//   CancelButton,
//   SaveButton,
// } from "./WarehouseModal.styles";

// const DEFAULT_FORM_DATA = {
//   warehouseName: "",
//   warehouseCode: "",
//   warehouseType: "",
//   manager: "",
//   status: "",
//   operatingSince: "",
//   country: "",
//   city: "",
//   addressLine1: "",
//   addressLine2: "",
//   postalCode: "",
//   phoneNumber: "",
//   email: "",
//   storageCapacity: "",
//   notes: "",
// };

// const WarehouseModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
// }) => {
//   const [formData, setFormData] = useState({
//     ...DEFAULT_FORM_DATA,
//     ...(initialData || {}),
//   });

//   /* =======================================================
//      RESET FORM WHEN MODAL OPENS
//   ======================================================= */

//   useEffect(() => {
//     if (!isOpen) {
//       return;
//     }

//     setFormData({
//       ...DEFAULT_FORM_DATA,
//       ...(initialData || {}),
//     });
//   }, [isOpen, initialData]);

//   /* =======================================================
//      ESCAPE KEY
//   ======================================================= */

//   useEffect(() => {
//     if (!isOpen) {
//       return undefined;
//     }

//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     document.addEventListener(
//       "keydown",
//       handleEscape,
//     );

//     return () => {
//       document.removeEventListener(
//         "keydown",
//         handleEscape,
//       );
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) {
//     return null;
//   }

//   /* =======================================================
//      INPUT CHANGE
//   ======================================================= */

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   /* =======================================================
//      SUBMIT
//   ======================================================= */

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (!onSubmit) {
//       return;
//     }

//     onSubmit(formData);
//   };

//   /* =======================================================
//      OVERLAY
//   ======================================================= */

//   const handleOverlayClick = (event) => {
//     if (event.target === event.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <Overlay onClick={handleOverlayClick}>
//       <ModalContainer
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="warehouse-modal-title"
//       >
//         <Header>
//           <Title id="warehouse-modal-title">
//             Add New Warehouse
//           </Title>

//           <Description>
//             Create a new warehouse to manage inventory
//             and stock operations.
//           </Description>
//         </Header>

//         <Form onSubmit={handleSubmit}>
//           <FormGrid>

//             {/* WAREHOUSE NAME */}

//             <Field>
//               <Label htmlFor="warehouseName">
//                 WAREHOUSE NAME
//               </Label>

//               <Input
//                 id="warehouseName"
//                 name="warehouseName"
//                 value={formData.warehouseName}
//                 onChange={handleChange}
//                 placeholder="Enter Warehouse Name"
//                 required
//               />
//             </Field>

//             {/* WAREHOUSE CODE */}

//             <Field>
//               <Label htmlFor="warehouseCode">
//                 WAREHOUSE CODE
//               </Label>

//               <Input
//                 id="warehouseCode"
//                 name="warehouseCode"
//                 value={formData.warehouseCode}
//                 onChange={handleChange}
//                 placeholder="Enter Warehouse Code"
//               />
//             </Field>

//             {/* WAREHOUSE TYPE */}

//             <Field>
//               <Label htmlFor="warehouseType">
//                 WAREHOUSE TYPE
//               </Label>

//               <Select
//                 id="warehouseType"
//                 name="warehouseType"
//                 value={formData.warehouseType}
//                 onChange={handleChange}
//               >
//                 <option value="">
//                   Select Type
//                 </option>

//                 <option value="main">
//                   Main
//                 </option>

//                 <option value="regional">
//                   Regional
//                 </option>

//                 <option value="distribution">
//                   Distribution
//                 </option>
//               </Select>
//             </Field>

//             {/* MANAGER */}

//             <Field>
//               <Label htmlFor="manager">
//                 MANAGER
//               </Label>

//               <Input
//                 id="manager"
//                 name="manager"
//                 value={formData.manager}
//                 onChange={handleChange}
//                 placeholder="Enter Manager Name"
//                 type="text"
//                 autoComplete="off"
//               />
//             </Field>

//             {/* STATUS */}

//             <Field>
//               <Label htmlFor="status">
//                 STATUS
//               </Label>

//               <Select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//               >
//                 <option value="">
//                   Select Status
//                 </option>

//                 <option value="active">
//                   Active
//                 </option>

//                 <option value="inactive">
//                   Inactive
//                 </option>
//               </Select>
//             </Field>

//             {/* OPERATING SINCE */}

//             <Field>
//               <Label htmlFor="operatingSince">
//                 OPERATING SINCE
//               </Label>

//               <Input
//                 id="operatingSince"
//                 name="operatingSince"
//                 type="date"
//                 value={formData.operatingSince}
//                 onChange={handleChange}
//               />
//             </Field>

//             {/* COUNTRY */}

//             <Field>
//               <Label htmlFor="country">
//                 COUNTRY
//               </Label>

//               <Input
//                 id="country"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 placeholder="Enter Country"
//               />
//             </Field>

//             {/* CITY */}

//             <Field>
//               <Label htmlFor="city">
//                 CITY
//               </Label>

//               <Input
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 placeholder="Enter City"
//               />
//             </Field>

//             {/* ADDRESS LINE 1 */}

//             <Field>
//               <Label htmlFor="addressLine1">
//                 ADDRESS LINE 1
//               </Label>

//               <Input
//                 id="addressLine1"
//                 name="addressLine1"
//                 value={formData.addressLine1}
//                 onChange={handleChange}
//                 placeholder="Enter Address"
//               />
//             </Field>

//             {/* ADDRESS LINE 2 */}

//             <Field>
//               <Label htmlFor="addressLine2">
//                 ADDRESS LINE 2
//               </Label>

//               <Input
//                 id="addressLine2"
//                 name="addressLine2"
//                 value={formData.addressLine2}
//                 onChange={handleChange}
//                 placeholder="Enter Address"
//               />
//             </Field>

//             {/* POSTAL CODE */}

//             <Field>
//               <Label htmlFor="postalCode">
//                 POSTAL CODE
//               </Label>

//               <Input
//                 id="postalCode"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleChange}
//                 placeholder="Enter Postal Code"
//               />
//             </Field>

//             {/* PHONE */}

//             <Field>
//               <Label htmlFor="phoneNumber">
//                 PHONE NUMBER
//               </Label>

//               <Input
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 type="tel"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="Enter Phone Number"
//               />
//             </Field>

//             {/* EMAIL */}

//             <Field>
//               <Label htmlFor="email">
//                 EMAIL
//               </Label>

//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter Email"
//               />
//             </Field>

//             {/* STORAGE CAPACITY */}

//             <Field>
//               <Label htmlFor="storageCapacity">
//                 STORAGE CAPACITY
//               </Label>

//               <Input
//                 id="storageCapacity"
//                 name="storageCapacity"
//                 value={formData.storageCapacity}
//                 onChange={handleChange}
//                 placeholder="Enter Storage Capacity"
//               />
//             </Field>

//             {/* NOTES */}

//             <Field>
//               <Label htmlFor="notes">
//                 NOTES
//               </Label>

//               <Input
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 placeholder="Enter Notes"
//               />
//             </Field>

//           </FormGrid>

//           <ButtonGroup>
//             <CancelButton
//               type="button"
//               onClick={onClose}
//             >
//               CANCEL
//             </CancelButton>

//             <SaveButton type="submit">
//               <FiSave size={14} />
//               SAVE WAREHOUSE
//             </SaveButton>
//           </ButtonGroup>
//         </Form>
//       </ModalContainer>
//     </Overlay>
//   );
// };

// export default WarehouseModal;

import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";

import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  Description,
  Form,
  FormGrid,
  Field,
  Label,
  Input,
  Select,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./WarehouseModal.styles";

const DEFAULT_FORM_DATA = {
  warehouseName: "",
  warehouseCode: "",
  warehouseType: "",
  manager: "",
  status: "",
  operatingSince: "",
  country: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  phoneNumber: "",
  email: "",
  storageCapacity: "",
  notes: "",
};

const WarehouseModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(initialData || {}),
  });

  /* =======================================================
     RESET FORM WHEN MODAL OPENS
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      ...DEFAULT_FORM_DATA,
      ...(initialData || {}),
    });
  }, [isOpen, initialData]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, submitting]);

  if (!isOpen) {
    return null;
  }

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onSubmit || submitting) {
      return;
    }

    onSubmit(formData);
  };

  /* =======================================================
     OVERLAY
  ======================================================= */

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="warehouse-modal-title"
      >
        <Header>
          <Title id="warehouse-modal-title">
            {isEdit ? "Edit Warehouse" : "Add New Warehouse"}
          </Title>

          <Description>
            {isEdit
              ? "Update the warehouse details and save your changes."
              : "Create a new warehouse to manage inventory and stock operations."}
          </Description>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            {/* WAREHOUSE NAME */}

            <Field>
              <Label htmlFor="warehouseName">WAREHOUSE NAME</Label>

              <Input
                id="warehouseName"
                name="warehouseName"
                value={formData.warehouseName ?? ""}
                onChange={handleChange}
                placeholder="Enter Warehouse Name"
                required
                disabled={submitting}
              />
            </Field>

            {/* WAREHOUSE CODE */}

            <Field>
              <Label htmlFor="warehouseCode">WAREHOUSE CODE</Label>

              <Input
                id="warehouseCode"
                name="warehouseCode"
                value={formData.warehouseCode ?? ""}
                onChange={handleChange}
                placeholder="Enter Warehouse Code"
                disabled={submitting}
              />
            </Field>

            {/* WAREHOUSE TYPE */}

            <Field>
              <Label htmlFor="warehouseType">WAREHOUSE TYPE</Label>

              <Select
                id="warehouseType"
                name="warehouseType"
                value={formData.warehouseType ?? ""}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select Type</option>

                <option value="main">Main</option>

                <option value="regional">Regional</option>

                <option value="distribution">Distribution</option>
              </Select>
            </Field>

            {/* MANAGER */}

            <Field>
              <Label htmlFor="manager">MANAGER</Label>

              <Input
                id="manager"
                name="manager"
                value={formData.manager ?? ""}
                onChange={handleChange}
                placeholder="Enter Manager Name"
                type="text"
                autoComplete="off"
                disabled={submitting}
              />
            </Field>

            {/* STATUS */}

            <Field>
              <Label htmlFor="status">STATUS</Label>

              <Select
                id="status"
                name="status"
                value={formData.status ?? ""}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select Status</option>

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </Select>
            </Field>

            {/* OPERATING SINCE */}

            <Field>
              <Label htmlFor="operatingSince">OPERATING SINCE</Label>

              <Input
                id="operatingSince"
                name="operatingSince"
                type="date"
                value={formData.operatingSince ?? ""}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>

            {/* COUNTRY */}

            <Field>
              <Label htmlFor="country">COUNTRY</Label>

              <Input
                id="country"
                name="country"
                value={formData.country ?? ""}
                onChange={handleChange}
                placeholder="Enter Country"
                disabled={submitting}
              />
            </Field>

            {/* CITY */}

            <Field>
              <Label htmlFor="city">CITY</Label>

              <Input
                id="city"
                name="city"
                value={formData.city ?? ""}
                onChange={handleChange}
                placeholder="Enter City"
                disabled={submitting}
              />
            </Field>

            {/* ADDRESS LINE 1 */}

            <Field>
              <Label htmlFor="addressLine1">ADDRESS LINE 1</Label>

              <Input
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1 ?? ""}
                onChange={handleChange}
                placeholder="Enter Address"
                disabled={submitting}
              />
            </Field>

            {/* ADDRESS LINE 2 */}

            <Field>
              <Label htmlFor="addressLine2">ADDRESS LINE 2</Label>

              <Input
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2 ?? ""}
                onChange={handleChange}
                placeholder="Enter Address"
                disabled={submitting}
              />
            </Field>

            {/* POSTAL CODE */}

            <Field>
              <Label htmlFor="postalCode">POSTAL CODE</Label>

              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode ?? ""}
                onChange={handleChange}
                placeholder="Enter Postal Code"
                disabled={submitting}
              />
            </Field>

            {/* PHONE */}

            <Field>
              <Label htmlFor="phoneNumber">PHONE NUMBER</Label>

              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber ?? ""}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                disabled={submitting}
              />
            </Field>

            {/* EMAIL */}

            <Field>
              <Label htmlFor="email">EMAIL</Label>

              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email ?? ""}
                onChange={handleChange}
                placeholder="Enter Email"
                disabled={submitting}
              />
            </Field>

            {/* STORAGE CAPACITY */}

            <Field>
              <Label htmlFor="storageCapacity">STORAGE CAPACITY</Label>

              <Input
                id="storageCapacity"
                name="storageCapacity"
                value={formData.storageCapacity ?? ""}
                onChange={handleChange}
                placeholder="Enter Storage Capacity"
                disabled={submitting}
              />
            </Field>

            {/* NOTES */}

            <Field>
              <Label htmlFor="notes">NOTES</Label>

              <Input
                id="notes"
                name="notes"
                value={formData.notes ?? ""}
                onChange={handleChange}
                placeholder="Enter Notes"
                disabled={submitting}
              />
            </Field>
          </FormGrid>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <FiSave size={14} />

              {submitting
                ? "SAVING..."
                : isEdit
                  ? "UPDATE WAREHOUSE"
                  : "SAVE WAREHOUSE"}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default WarehouseModal;

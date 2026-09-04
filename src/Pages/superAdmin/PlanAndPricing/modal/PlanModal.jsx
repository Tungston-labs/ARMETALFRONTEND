import React, { useEffect, useState } from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Form,
  Row,
  Field,
  Label,
  Input,
  Select,
  PriceInputWrapper,
  TextArea,
  FeatureSection,
  FeatureHeader,
  AddFeatureButton,
  FeatureList,
  FeatureItem,
  Checkbox,
  RemoveButton,
  Footer,
  CancelButton,
  SubmitButton,
  Rows,
  Required,
  ErrorMessage,
  FormError,
  FeatureInputWrapper,
  FeatureInput,
  FeatureEmpty,
  FeatureLoading,
} from "./PlanModal.styles";

import { IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
  fetchSubscriptionFeatures,
  createSubscriptionFeature,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../../../../services/superAdminService";

const initialForm = {
  planName: "",
  tier: "",
  employeeLimit: "",
  price: "",
  extraCharge: "",
  description: "",
  features: [],
};

function PlanModal({
  open,
  mode = "add",
  initialData = null,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(initialForm);

  const [featureInput, setFeatureInput] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");

  const [availableFeatures, setAvailableFeatures] = useState([]);

  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [addingFeature, setAddingFeature] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  /*
   * Load features whenever modal opens
   */
  useEffect(() => {
    if (!open) return;

    loadFeatures();

    setErrors({});
    setSubmitError("");

    if (mode === "edit" && initialData) {
      setFormData({
        ...initialForm,

        planName:
          initialData.name ||
          initialData.planName ||
          "",

        tier:
          initialData.plan_type ||
          initialData.tier ||
          "",

        employeeLimit:
          initialData.employee_limit ||
          initialData.employeeLimit ||
          "",

        price:
          initialData.base_price ||
          initialData.price ||
          "",

        extraCharge:
          initialData.extra_employee_price ||
          initialData.extraCharge ||
          "",

        description:
          initialData.description ||
          "",

        features:
          initialData.features ||
          [],
      });
    } else {
      setFormData(initialForm);
    }

    setFeatureInput("");
    setFeatureDescription("");
  }, [mode, initialData, open]);

  /*
   * GET /subscription-features/
   */
  const loadFeatures = async () => {
    try {
      setLoadingFeatures(true);

      const response = await fetchSubscriptionFeatures();

      console.log(
        "Subscription features response:",
        response
      );

      const features = Array.isArray(response)
        ? response
        : response?.results || [];

      setAvailableFeatures(features);
    } catch (error) {
      console.error(
        "Failed to fetch subscription features:",
        error
      );

      setSubmitError(
        error.response?.data?.detail ||
          "Failed to load subscription features."
      );
    } finally {
      setLoadingFeatures(false);
    }
  };

  /*
   * Normal form fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
     * Clear error for this field
     * when user starts correcting it.
     */
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };

        delete updated[name];

        return updated;
      });
    }

    /*
     * Clear general API error
     */
    if (submitError) {
      setSubmitError("");
    }
  };

  /*
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    /*
     * Plan Name
     */
    if (!formData.planName.trim()) {
      newErrors.planName =
        "Plan name is required.";
    }

    /*
     * Tier
     */
    if (!formData.tier) {
      newErrors.tier =
        "Please select a tier.";
    }

    /*
     * Employee Limit
     */
    if (!formData.employeeLimit) {
      newErrors.employeeLimit =
        "Employee limit is required.";
    } else if (
      Number(formData.employeeLimit) <= 0
    ) {
      newErrors.employeeLimit =
        "Employee limit must be greater than 0.";
    }

    /*
     * Price
     */
    if (!formData.price) {
      newErrors.price =
        "Plan price is required.";
    } else if (
      Number(formData.price) <= 0
    ) {
      newErrors.price =
        "Plan price must be greater than 0.";
    }

    /*
     * Extra Employee Charge
     */
    if (
      formData.extraCharge &&
      Number(formData.extraCharge) < 0
    ) {
      newErrors.extraCharge =
        "Extra employee charge cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * POST /subscription-features/
   *
   * Create a new feature.
   */
  const addFeature = async () => {
    const name = featureInput.trim();

    /*
     * Clear previous error
     */
    setSubmitError("");

    if (!name) {
      setSubmitError(
        "Please enter a feature name."
      );
      return;
    }

    try {
      setAddingFeature(true);

      const response =
        await createSubscriptionFeature({
          name: name,
          description:
            featureDescription.trim(),
          is_active: true,
        });

      /*
       * API may return:
       *
       * {
       *   id: 5,
       *   name: "...",
       *   description: "...",
       *   is_active: true
       * }
       */

      const newFeature =
        response?.data || response;

      /*
       * Add newly created feature
       * to local feature list.
       */
      setAvailableFeatures((prev) => [
        ...prev,
        newFeature,
      ]);

      /*
       * Automatically select
       * newly created feature.
       */
      setFormData((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          newFeature,
        ],
      }));

      /*
       * Clear inputs
       */
      setFeatureInput("");
      setFeatureDescription("");

      setSubmitError("");
    } catch (error) {
      console.error(
        "Failed to create feature:",
        error
      );

      const errorData =
        error.response?.data;

      setSubmitError(
        errorData?.name?.[0] ||
          errorData?.detail ||
          "Failed to create feature."
      );
    } finally {
      setAddingFeature(false);
    }
  };

  /*
   * Tick / untick existing feature
   */
  const toggleFeature = (feature) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.features.some(
          (item) => item.id === feature.id
        );

      if (alreadySelected) {
        return {
          ...prev,
          features:
            prev.features.filter(
              (item) =>
                item.id !== feature.id
            ),
        };
      }

      return {
        ...prev,
        features: [
          ...prev.features,
          feature,
        ],
      };
    });

    setSubmitError("");
  };

  /*
   * Remove selected feature from plan.
   *
   * This does NOT delete feature
   * from database.
   */
  const removeFeature = (featureId) => {
    setFormData((prev) => ({
      ...prev,
      features:
        prev.features.filter(
          (item) =>
            item.id !== featureId
        ),
    }));
  };

  /*
   * Submit Plan
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * Clear previous API error
     */
    setSubmitError("");

    /*
     * Validate frontend fields
     */
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setSubmitting(true);

      const planType =
        formData.tier.toLowerCase();

      /*
       * Only send feature IDs
       */
      const selectedFeatureIds =
        formData.features.map(
          (feature) => feature.id
        );

      const payload = {
        name: formData.planName.trim(),

        plan_type: planType,

        description:
          formData.description.trim(),

        employee_limit:
          Number(formData.employeeLimit),

        feature_ids:
          selectedFeatureIds,

        base_price:
          formData.price,

        extra_employee_price:
          formData.extraCharge || "0",

        is_active: true,
      };

      console.log(
        "Plan payload:",
        payload
      );

      /*
       * EDIT
       */
      if (
        mode === "edit" &&
        initialData?.id
      ) {
        await updateSubscriptionPlan(
          initialData.id,
          payload
        );
      }

      /*
       * CREATE
       */
      else {
        await createSubscriptionPlan(
          payload
        );
      }

      /*
       * Refresh parent table
       */
      await onSubmit?.();

      /*
       * Close modal
       */
      onClose();
    } catch (error) {
      console.error(
        mode === "edit"
          ? "Failed to update plan:"
          : "Failed to create plan:",
        error
      );

      const errorData =
        error.response?.data;

      /*
       * Backend validation errors
       */
      if (errorData) {
        const backendErrors = {};

        if (errorData.name) {
          backendErrors.planName =
            Array.isArray(errorData.name)
              ? errorData.name[0]
              : errorData.name;
        }

        if (errorData.plan_type) {
          backendErrors.tier =
            Array.isArray(
              errorData.plan_type
            )
              ? errorData.plan_type[0]
              : errorData.plan_type;
        }

        if (errorData.employee_limit) {
          backendErrors.employeeLimit =
            Array.isArray(
              errorData.employee_limit
            )
              ? errorData.employee_limit[0]
              : errorData.employee_limit;
        }

        if (errorData.base_price) {
          backendErrors.price =
            Array.isArray(
              errorData.base_price
            )
              ? errorData.base_price[0]
              : errorData.base_price;
        }

        if (
          errorData.extra_employee_price
        ) {
          backendErrors.extraCharge =
            Array.isArray(
              errorData.extra_employee_price
            )
              ? errorData
                  .extra_employee_price[0]
              : errorData
                  .extra_employee_price;
        }

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));

        /*
         * General backend error
         */
        setSubmitError(
          errorData.detail ||
            errorData.message ||
            ""
        );
      } else {
        setSubmitError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Don't render modal when closed
   */
  if (!open) return null;

  /*
   * IDs of selected features
   */
  const selectedFeatureIds =
    formData.features.map(
      (feature) => feature.id
    );

  return (
    <Overlay>
      <Modal>
        {/* HEADER */}

        <Header>
          <Title>
            {mode === "add"
              ? "Add New Plan"
              : "Edit Plan"}
          </Title>

          <CloseButton
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* GENERAL ERROR */}

          {submitError && (
            <FormError>
              {submitError}
            </FormError>
          )}

          {/* PLAN NAME + TIER */}

          <Row>
            <Field>
              <Label>
                Plan Name
                <Required>*</Required>
              </Label>

              <Input
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                placeholder="Enter plan name"
                autoComplete="off"
                $hasError={
                  !!errors.planName
                }
              />

              {errors.planName && (
                <ErrorMessage>
                  {errors.planName}
                </ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>
                Tier
                <Required>*</Required>
              </Label>

              <Select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                $hasError={!!errors.tier}
              >
                <option value="">
                  Select Tier
                </option>

                <option value="basic">
                  Basic
                </option>

                <option value="pro">
                  Pro
                </option>

                <option value="enterprise">
                  Enterprise
                </option>

                <option value="custom">
                  Custom
                </option>
              </Select>

              {errors.tier && (
                <ErrorMessage>
                  {errors.tier}
                </ErrorMessage>
              )}
            </Field>
          </Row>

          {/* EMPLOYEE COUNT */}

          <Row>
            <Field>
              <Label>
                Employee Limit
                <Required>*</Required>
              </Label>

              <Input
                type="number"
                name="employeeLimit"
                value={
                  formData.employeeLimit
                }
                onChange={handleChange}
                placeholder="10"
                autoComplete="off"
                min="1"
                $hasError={
                  !!errors.employeeLimit
                }
              />

              {errors.employeeLimit && (
                <ErrorMessage>
                  {errors.employeeLimit}
                </ErrorMessage>
              )}
            </Field>
          </Row>

          {/* PRICE */}

          <Rows>
            <Field>
              <Label>
                Price / Month
                <Required>*</Required>
              </Label>

              <PriceInputWrapper>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1500"
                  autoComplete="off"
                  min="0"
                  step="0.01"
                  $hasError={
                    !!errors.price
                  }
                />
              </PriceInputWrapper>

              {errors.price && (
                <ErrorMessage>
                  {errors.price}
                </ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>
                Extra Employee Charge
                <Required>*</Required>
              </Label>

              <PriceInputWrapper>
                <Input
                  type="number"
                  name="extraCharge"
                  value={
                    formData.extraCharge
                  }
                  onChange={handleChange}
                  placeholder="Per Employee"
                  autoComplete="off"
                  min="0"
                  step="0.01"
                  $hasError={
                    !!errors.extraCharge
                  }
                />
              </PriceInputWrapper>

              {errors.extraCharge && (
                <ErrorMessage>
                  {errors.extraCharge}
                </ErrorMessage>
              )}
            </Field>
          </Rows>

          {/* DESCRIPTION */}

          <Field>
            <Label>
              Description
            </Label>

            <TextArea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Enter plan description"
              autoComplete="off"
              rows={3}
            />
          </Field>

          {/* FEATURES */}

          <FeatureSection>
            <FeatureHeader>
              <Label>
                Features
              </Label>

              <AddFeatureButton
                type="button"
                onClick={addFeature}
                disabled={
                  addingFeature
                }
              >
                <FiPlus />

                {addingFeature
                  ? "Adding..."
                  : "Add"}
              </AddFeatureButton>
            </FeatureHeader>

            {/* NEW FEATURE */}

            <FeatureInputWrapper>
              <FeatureInput
                type="text"
                value={featureInput}
                onChange={(e) => {
                  setFeatureInput(
                    e.target.value
                  );

                  if (submitError) {
                    setSubmitError("");
                  }
                }}
                placeholder="Enter new feature name"
                autoComplete="off"
              />

              
            </FeatureInputWrapper>

            {/* EXISTING FEATURES */}

            <FeatureList>
              {loadingFeatures ? (
                <FeatureLoading>
                  Loading features...
                </FeatureLoading>
              ) : availableFeatures.length ===
                0 ? (
                <FeatureEmpty>
                  No features available.
                </FeatureEmpty>
              ) : (
                availableFeatures.map(
                  (feature) => {
                    const isChecked =
                      selectedFeatureIds.includes(
                        feature.id
                      );

                    return (
                      <FeatureItem
                        key={feature.id}
                      >
                        <Checkbox>
                          <input
                            type="checkbox"
                            checked={
                              isChecked
                            }
                            onChange={() =>
                              toggleFeature(
                                feature
                              )
                            }
                          />

                          <span>
                            {feature.name}
                          </span>
                        </Checkbox>

                        {isChecked && (
                          <RemoveButton
                            type="button"
                            onClick={() =>
                              removeFeature(
                                feature.id
                              )
                            }
                            aria-label={`Remove ${feature.name}`}
                          >
                            <RiDeleteBin6Line />
                          </RemoveButton>
                        )}
                      </FeatureItem>
                    );
                  }
                )
              )}
            </FeatureList>
          </FeatureSection>

          {/* FOOTER */}

          <Footer>
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </CancelButton>

            <SubmitButton
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : mode === "add"
                ? "Create Plan"
                : "Update Plan"}
            </SubmitButton>
          </Footer>
        </Form>
      </Modal>
    </Overlay>
  );
}

export default PlanModal;
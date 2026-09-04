import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PiUserCircleThin } from "react-icons/pi";

import {
  StepperHeader,
  StepperTrack,
  StepItem,
  StepNode,
  StepCircle,
  StepLabel,
  StepProgressBar,
  StepConnector,
} from "../../../Pages/employee/ViewForm/ProfileUploader.styles";

import ProfileUploader from "../../../Pages/employee/ViewForm/ProfileUploader";

/**
 * Renders the gradient header bar: avatar on the left (overhanging the
 * bottom edge) plus a clickable step track on the right.
 *
 * Routes default to /ViewBasic/:id, /ViewBasic/:id/bank,
 * /ViewBasic/:id/documents, with :id pulled from the current URL via
 * useParams — this only works because Stepper is rendered inside a route
 * that has an :id segment (per your router config). Pass an explicit
 * `routes` array to override this if needed.
 *
 * @param {number} currentStep - 1-indexed fallback position of the active
 *   step, used only if the current URL doesn't match any entry in `routes`
 * @param {string[]} steps - labels for each step, in order
 * @param {string[]} [routes] - explicit route path for each step, in the
 *   same order as `steps`. Overrides the :id-based defaults if provided.
 */
const Stepper = ({
  currentStep = 1,
  steps = ["Basic Details", "Bank Details", "Documents"],
  routes,
  profileImageSrc = null,
  editable = false,
  onProfileImageChange,
  embedded = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const resolvedRoutes =
    routes ??
    (id != null
      ? [`/ViewBasic/${id}`, `/ViewBasic/${id}/bank`, `/ViewBasic/${id}/documents`]
      : []);

  /*
   * Prefer the URL for figuring out which step is active. If the current
   * path isn't one of resolvedRoutes (e.g. no :id param and no routes
   * prop was passed), fall back to the currentStep prop.
   */
  const urlStepIndex = resolvedRoutes.findIndex(
    (route) => location.pathname === route
  );

  const selectedStep =
    urlStepIndex !== -1 ? urlStepIndex + 1 : currentStep;

  const handleStepClick = (index) => {
    const route = resolvedRoutes[index];

    if (route) {
      navigate(route);
    }
  };

  return (
    <StepperHeader $embedded={embedded}>
      <ProfileUploader
        profileImageSrc={profileImageSrc}
        editable={editable}
        onProfileImageChange={onProfileImageChange}
      />

      <StepperTrack>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === selectedStep;
          const isLast = stepNumber === steps.length;
          const hasRoute = Boolean(resolvedRoutes[index]);

          return (
            <StepItem key={label}>
              <StepNode
                onClick={() => handleStepClick(index)}
                role={hasRoute ? "button" : undefined}
                tabIndex={hasRoute ? 0 : undefined}
                $clickable={hasRoute}
                onKeyDown={(e) => {
                  if (!hasRoute) return;

                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStepClick(index);
                  }
                }}
              >
                <StepCircle $active={isActive}>
                  <PiUserCircleThin size={20} />
                </StepCircle>

                <StepLabel $active={isActive}>{label}</StepLabel>

                {isActive && <StepProgressBar />}
              </StepNode>

              {!isLast && <StepConnector $active={stepNumber < selectedStep} />}
            </StepItem>
          );
        })}
      </StepperTrack>
    </StepperHeader>
  );
};

export default Stepper;
import React, { useEffect, useState } from "react";
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Hr,
  FormField,
  Label,
  Input,
  CheckboxGroup,
  CheckboxLabel,
  TitleSection,
  BlockSection,
  BlockText,
  Switch,
  Title,
  Subtitle
} from "./View.Styles";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyById,
  clearSelectedCompany,
} from "../../Redux/companySlice";
import {
  updateCompanyStatusThunk,
} from "../../Redux/superAdminSlice";
import { useParams, useNavigate } from "react-router-dom";
import Plan from "../../Components/superadmin/Plan";
import { LuArrowLeft } from "react-icons/lu";
import Loader from "../../Components/Loader/Loader"
const CompanyViewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBlocked, setIsBlocked] = useState(false);
  const selectedCompany = useSelector(
    (state) => state.company.selectedCompany,
  );

  useEffect(() => {
    if (id) {
      dispatch(getCompanyById(id));
    }

    return () => {
      dispatch(clearSelectedCompany());
    };
  }, [dispatch, id]);
  useEffect(() => {
    if (selectedCompany) {
      console.log(selectedCompany);
      console.log("is_active:", selectedCompany.is_active);

      setIsBlocked(!selectedCompany.is_active);
    }
  }, [selectedCompany]);

  if (!selectedCompany) return <Loader />;

  const allModules = ["dashboard", "employee", "department", "daily_task", "payroll", "holiday", "reimbursement", "project", "finance"];
  const enabledModules = allModules.filter(mod => selectedCompany.modules?.[mod]);

  return (
    <>

      <FormWrapper>
        <TitleSection>
          <div className="left">
            <LuArrowLeft
              style={{ width: "30px", height: 30, cursor: "pointer" }}
              onClick={() => navigate("/company")}
            />

            <img
              src="/images/superadminlogo.png"
              alt="Payroll Icon"
              style={{ height: "50px" }}
            />

            <div>
              <Title>Super admin</Title>
              <Subtitle>
                Manage all departments within the organization.
              </Subtitle>
            </div>
          </div>

          <BlockSection>
            <BlockText blocked={isBlocked}>
              {isBlocked ? "Company Blocked" : "Company Active"}
            </BlockText>

            <Switch>
              <input
                type="checkbox"
                checked={isBlocked}
                onChange={async (e) => {
                  const checked = e.target.checked;
                  setIsBlocked(checked);

                  try {
                    const result = await dispatch(
                      updateCompanyStatusThunk({
                        companyId: selectedCompany.id,
                        action: checked ? "freeze" : "unfreeze",
                      })
                    ).unwrap();

                    console.log("✅ Thunk succeeded, result:", result); // <--- ADD THIS

                  } catch (error) {
                    setIsBlocked(!checked);
                    console.error("❌ Thunk failed:", error); // <--- you already log, but check what error actually is
                    alert("Failed to update company status");
                  }
                }}
              />
              <span className="slider"></span>
            </Switch>
          </BlockSection>
        </TitleSection>


        <FormSection>
          <div>
            <FormField>
              <Label>Company Name</Label>
              <Input type="text" value={selectedCompany.name} readOnly />
            </FormField>

            <FormField>
              <Label>Address</Label>
              <Input type="text" value={selectedCompany.address} readOnly />
            </FormField>

            <FormField>
              <Label>Email</Label>
              <Input type="text" value={selectedCompany.email} readOnly />
            </FormField>

            <FormField>
              <Label>Plan Name</Label>
              <Input
                type="text"
                value={selectedCompany.plan_name ?? "No Plan"}
                readOnly
              />
            </FormField>



            <FormField>
              <Label>Amount Per Employee</Label>
              <Input
                type="text"
                value={selectedCompany.amount_per_employee ?? 0}
                readOnly
              />
            </FormField>

            <FormField>
              <Label>Initial Payment</Label>
              <Input
                type="text"
                value={selectedCompany.initial_payment ?? 0}
                readOnly
              />
            </FormField>


            <FormField>
              <Label style={{ fontFamily: "satoshi", fontStyle: "bold" }}>
                Upload logo
              </Label>
              {selectedCompany.logo ? (
                <img
                  src={selectedCompany.logo}
                  alt="Company Logo"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "4px",
                    backgroundColor: "#fff",
                  }}
                />
              ) : (
                <p style={{ color: "#888", fontStyle: "italic" }}>
                  No logo uploaded
                </p>
              )}
            </FormField>
          </div>

          <div>
            <FormField>
              <Label>Company location</Label>
              <Input type="text" value={selectedCompany.location} readOnly />
            </FormField>

            <FormField>
              <Label>Contact Number</Label>
              <Input
                type="text"
                value={selectedCompany.contact_number}
                readOnly
              />
            </FormField>

            <FormField>
              <Label>No. of Employees</Label>
              <Input
                type="text"
                value={selectedCompany.number_of_employees}
                readOnly
              />
            </FormField>

            <FormField>
              <Label>Latitude</Label>
              <Input type="text" value={selectedCompany.latitude} readOnly />
            </FormField>

            <FormField>
              <Label>Longitude</Label>
              <Input type="text" value={selectedCompany.longitude} readOnly />
            </FormField>
          </div>
        </FormSection>

        <h4>Privileges</h4>
        <CheckboxGroup>
          {allModules.map((mod) => (
            <CheckboxLabel key={mod}>
              <input
                type="checkbox"
                value={mod}
                checked={selectedCompany.modules?.[mod]}
                disabled
              />
              {mod.charAt(0).toUpperCase() + mod.slice(1).replace("_", " ")}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>

        <Hr />

        <Plan />
      </FormWrapper>
    </>
  );
};

export default CompanyViewPage;

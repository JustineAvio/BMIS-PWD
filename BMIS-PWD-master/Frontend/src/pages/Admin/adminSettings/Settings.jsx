import { useState } from "react";
import "./settings.css";
import { toast } from 'react-toastify';

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    officeName: "",
    adminEmail: "",
    contactNumber: "",
    address: "",
    timezone: "",
    notifications: true,
    enableTwoFactor: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Save settings", settings, activeSection);
    toast.success(`Saved ${activeSection} settings.`);
  };

  return (
    <div className="content admin-settings-page">
      <div className="page-header">
        <div>
          <h3>Admin Settings</h3>
          <p className="page-description">Configure your barangay system preferences, security options, and notification settings.</p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-menu">
          <div className="menu-title">Settings</div>
          <button
            className={`menu-button ${activeSection === "general" ? "active" : ""}`}
            onClick={() => setActiveSection("general")}
          >
            General
          </button>
          <button
            className={`menu-button ${activeSection === "security" ? "active" : ""}`}
            onClick={() => setActiveSection("security")}
          >
            Security
          </button>
          <button
            className={`menu-button ${activeSection === "notifications" ? "active" : ""}`}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </button>
        </aside>

        <section className="settings-panel">
          <div className="panel-header">
            <h4>{activeSection === "general" ? "General Settings" : activeSection === "security" ? "Security Settings" : "Notification Preferences"}</h4>
            <p className="panel-description">
              {activeSection === "general"
                ? "Update business information and contact details for admin communication."
                : activeSection === "security"
                ? "Manage password and two-factor access controls for the admin account."
                : "Control when and how the barangay system sends alerts and updates."}
            </p>
          </div>

          <div className="panel-body">
            {activeSection === "general" && (
              <>
                <div className="field-row">
                  <label>Office Name</label>
                  <input
                    type="text"
                    value={settings.officeName}
                    onChange={(e) => handleInputChange("officeName", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    value={settings.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Barangay Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                  >
                    <option value="(GMT+8) Manila">(GMT+8) Manila</option>
                    <option value="(GMT+7) Bangkok">(GMT+7) Bangkok</option>
                    <option value="(GMT+9) Tokyo">(GMT+9) Tokyo</option>
                  </select>
                </div>
              </>
            )}

            {activeSection === "security" && (
              <>
                <div className="field-row">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={settings.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                </div>
                <div className="field-row switch-row">
                  <span>Enable Two-Factor Authentication</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.enableTwoFactor}
                      onChange={(e) => handleInputChange("enableTwoFactor", e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <div className="field-row switch-row">
                  <span>Email alerts for new submissions</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleInputChange("notifications", e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>
                <div className="field-row">
                  <label>Notification frequency</label>
                  <select
                    value={settings.notifications ? "instant" : "daily"}
                    onChange={(e) => handleInputChange("notificationFrequency", e.target.value)}
                  >
                    <option value="instant">Instant</option>
                    <option value="daily">Daily summary</option>
                    <option value="weekly">Weekly summary</option>
                  </select>
                </div>
                <div className="note-box">
                  <strong>Tip:</strong> Keep notification alerts enabled to stay informed about incoming resident applications and system updates.
                </div>
              </>
            )}
          </div>

          <div className="panel-actions">
            <button className="save-btn" onClick={handleSave}>
              Save settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

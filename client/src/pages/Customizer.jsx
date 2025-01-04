// Import necessary libraries and components
import { useState, useEffect } from "react"; // React hooks for state and lifecycle management
import { AnimatePresence, motion } from "framer-motion"; // For animations
import { useSnapshot } from "valtio"; // For reactive state management

// Import configuration files and assets
import config from "../config/config"; // Configuration for customization
import state from "../store"; // Centralized state using Valtio
import { download, logoShirt } from "../assets"; // Assets like icons or images
import { downloadCanvasToImage, reader } from "../config/helpers"; // Utility functions
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants"; // Tab and decal configurations
import { fadeAnimation, slideAnimation } from "../config/motion"; // Animation configurations

// Import custom components
import {
  AIPicker,
  ColorPicker,
  FilePicker,
  CustomButton,
  Tab,
} from "../components"; // Various UI components

// Main Customizer component
const Customizer = () => {
  const snap = useSnapshot(state); // Reactive snapshot of the state
  const [file, setFile] = useState(""); // State for the uploaded file
  const [prompt, setPrompt] = useState(""); // State for AI image prompt
  const [generatingImg, setGeneratingImg] = useState(false); // Tracks AI image generation status
  const [activeEditorTab, setActiveEditorTab] = useState(""); // Currently active editor tab
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  }); // Active filter tab for textures

  /**
   * Generates the content for the active editor tab.
   * Returns a specific component based on the active tab.
   */
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />; // Renders the color picker
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />; // Renders the file picker
      case "aipicker":
        return <AIPicker 
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={generatingImg}
        handleSubmit={handleSubmit}
        />; // Renders the AI picker
      default:
        return null; // No active tab
    }
  };

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      // call the backend
    } catch (error) {
      alert(error)
    } finally{
      setGeneratingImg(false);
      setActiveEditorTab("");
    }

  }

  /**
   * Handles the application of decals (textures) on the shirt.
   * @param {string} type - The type of decal (e.g., logo or full texture).
   * @param {string} result - The decal data to apply.
   */
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type]; // Get decal configuration
    state[decalType.stateProperty] = result; // Update state with decal data
    if (!activeFilterTab[decalType.FilterTabs]) {
      handleActiveFilterTab(decalType.isFilterTab); // Toggle filter tab if inactive
    }
  };

  /**
   * Toggles the active state of filter tabs.
   * @param {string} tabName - The name of the filter tab to toggle.
   */
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]; // Toggle logo texture
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]; // Toggle full texture
        break;
      default:
        state.isLogoTexture = true; // Default to logo texture
        state.isFullTexture = false;
    }

    // after setting the state, update the activeFilterTab
    setActiveFilterTab((prevState) => {
      return { ...prevState, [tabName]: !prevState[tabName] };
    });
  };

  /**
   * Reads the uploaded file and applies it as a decal.
   * @param {string} type - The type of decal to apply.
   */
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result); // Apply the decal
      setActiveEditorTab(""); // Close the active editor tab
    });
  };

  return (
    <AnimatePresence>
      {/* Render the customizer only when snap.intro is false */}
      {!snap.intro && (
        <>
          {/* Sidebar for editor tabs */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)} // Set the active tab
                  />
                ))}
                {generateTabContent()} {/* Render tab content */}
              </div>
            </div>
          </motion.div>

          {/* Button to return to the intro page */}
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)} // Set intro state to true
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          {/* Bottom filter tabs for applying textures */}
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)} // Handle filter tab click
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer; // Export the component

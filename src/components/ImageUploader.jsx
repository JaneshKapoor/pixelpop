import { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { pageAtom, pages, addImageAtom } from "./UI";

export const ImageUploader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
  });
  const fileInputRef = useRef(null);
  const [, setPage] = useAtom(pageAtom);
  const [, addImage] = useAtom(addImageAtom);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(file);
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      sepia: 0,
    });
  };

  const handleAddToBook = async () => {
    if (!previewUrl) return;

    // Create a canvas to apply filters
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Get the filtered image as data URL
      const filteredImageUrl = canvas.toDataURL("image/jpeg");
      
      // Add the image to the book
      addImage(filteredImageUrl);
      
      // Close the dialog and reset
      setIsOpen(false);
      setImage(null);
      setPreviewUrl(null);
      resetFilters();
      
      // Navigate to page 1
      setPage(1);
    };
    
    img.src = previewUrl;
  };

  const handleCancel = () => {
    setIsOpen(false);
    setImage(null);
    setPreviewUrl(null);
    resetFilters();
  };

  // Close dialog when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Upload Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-10 right-10 z-20 pointer-events-auto bg-white/90 hover:bg-white text-black px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 border-transparent hover:border-white shadow-lg"
      >
        Upload Image
      </button>

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2a2a42] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Image to PixelPop</h2>
              <button
                onClick={handleCancel}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Panel - Controls */}
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="bg-[#3a3a52] p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Upload Image</h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full bg-[#5a47ce] hover:bg-[#6a57de] py-2 px-4 rounded-lg transition-colors"
                  >
                    Select Image
                  </button>
                </div>

                {/* Filters */}
                <div className="bg-[#3a3a52] p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Filters</h3>
                  <div className="space-y-4">
                    {[
                      { name: "brightness", min: 0, max: 200, label: "Brightness" },
                      { name: "contrast", min: 0, max: 200, label: "Contrast" },
                      { name: "saturate", min: 0, max: 200, label: "Saturation" },
                      { name: "grayscale", min: 0, max: 100, label: "Grayscale" },
                      { name: "sepia", min: 0, max: 100, label: "Sepia" },
                    ].map((filter) => (
                      <div key={filter.name} className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">{filter.label}</label>
                          <span className="text-sm">{filters[filter.name]}%</span>
                        </div>
                        <input
                          type="range"
                          min={filter.min}
                          max={filter.max}
                          value={filters[filter.name]}
                          onChange={(e) =>
                            applyFilter(filter.name, parseInt(e.target.value))
                          }
                          className="w-full accent-[#5a47ce]"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={resetFilters}
                    className="mt-4 w-full bg-[#3a3a52] border border-[#5a47ce] hover:bg-[#4a4a62] py-2 px-4 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="md:col-span-2">
                <div className="bg-[#3a3a52] p-4 rounded-lg h-full flex flex-col">
                  <h3 className="text-lg font-medium mb-3">Preview</h3>
                  <div className="flex-grow flex items-center justify-center bg-black/30 rounded-lg overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-[50vh] object-contain"
                        style={{
                          filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`,
                        }}
                      />
                    ) : (
                      <div className="text-center p-10 text-white/50">
                        <p>No image selected</p>
                        <p className="text-sm mt-2">
                          Upload an image to see preview
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-[#3a3a52] border border-white/20 hover:bg-[#4a4a62] py-3 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToBook}
                      disabled={!previewUrl}
                      className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                        previewUrl
                          ? "bg-[#5a47ce] hover:bg-[#6a57de]"
                          : "bg-[#5a47ce]/50 cursor-not-allowed"
                      }`}
                    >
                      Add to PixelPop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
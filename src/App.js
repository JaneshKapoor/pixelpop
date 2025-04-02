import { useState } from 'react';
import { FaRegSave, FaUndo } from 'react-icons/fa';
import { BsFilter, BsSliders } from 'react-icons/bs';

function App() {
  const [image, setImage] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0
  });

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const applyFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      sepia: 0
    });
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = image;
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      {/* Navbar */}
      <nav className="p-4 bg-primary text-light flex justify-between items-center">
        <h1 className="text-2xl font-bold">PixelPop</h1>
        <div className="flex space-x-4">
          <button 
            className="flex items-center space-x-2 bg-secondary px-4 py-2 rounded-lg"
            onClick={saveImage}
          >
            <FaRegSave /> <span>Save</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4">
          <div className="bg-light dark:bg-dark p-4 rounded-lg shadow-lg">
            <h3 className="flex items-center space-x-2 mb-4 text-primary">
              <BsFilter /> <span>Filters</span>
            </h3>
            <div className="space-y-2">
              {['grayscale', 'sepia'].map(filter => (
                <div key={filter} className="flex items-center justify-between">
                  <span>{filter}</span>
                  <input 
                    type="range"
                    min="0"
                    max={filter === 'sepia' ? 100 : 100}
                    value={filters[filter]}
                    onChange={(e) => applyFilter(filter, parseInt(e.target.value))}
                    className="w-2/3"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-light dark:bg-dark p-4 rounded-lg shadow-lg">
            <h3 className="flex items-center space-x-2 mb-4 text-primary">
              <BsSliders /> <span>Adjustments</span>
            </h3>
            <div className="space-y-2">
              {['brightness', 'contrast', 'saturate'].map(adjustment => (
                <div key={adjustment} className="flex items-center justify-between">
                  <span>{adjustment}</span>
                  <input 
                    type="range"
                    min={adjustment === 'brightness' ? 0 : 50}
                    max={adjustment === 'brightness' ? 200 : 200}
                    value={filters[adjustment]}
                    onChange={(e) => applyFilter(adjustment, parseInt(e.target.value))}
                    className="w-2/3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Preview */}
        <div className="col-span-2">
          <div className="relative aspect-w-16 aspect-h-9">
            {image ? (
              <img 
                src={image} 
                alt="Preview" 
                className="w-full h-full object-contain rounded-lg shadow-lg"
                style={{
                  filter: `
                    brightness(${filters.brightness}%)
                    contrast(${filters.contrast}%)
                    saturate(${filters.saturate}%)
                    grayscale(${filters.grayscale}%)
                    sepia(${filters.sepia}%)
                  `
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <label 
                  htmlFor="image-upload"
                  className="cursor-pointer bg-primary text-light px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  Upload Image
                </label>
                <input 
                  type="file" 
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { ImageUploader } from "./ImageUploader";

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "newbookcover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

// Create a new atom for adding images to the book
// Add this new atom at the top with other atoms
export const pagesVersionAtom = atom(0);

// Update the addImageAtom to use a simpler approach
export const addImageAtom = atom(
  null,
  (get, set, newImageUrl) => {
    // Create a unique filename for the uploaded image
    const timestamp = Date.now();
    const filename = `uploaded_${timestamp}`;
    
    // Store the image data URL directly in localStorage
    localStorage.setItem(`pixelpop_${filename}`, newImageUrl);
    console.log("Stored image in localStorage:", filename);
    
    // Replace the first image in the pictures array
    const newPictures = [...pictures];
    newPictures[0] = filename;
    
    // Rebuild the pages array with the new image
    const newPages = [
      { front: "newbookcover", back: newPictures[0] }
    ];
    
    for (let i = 1; i < newPictures.length - 1; i += 2) {
      newPages.push({
        front: newPictures[i],
        back: newPictures[i + 1],
      });
    }
    
    newPages.push({
      front: newPictures[newPictures.length - 1],
      back: "book-back",
    });
    
    // Update the arrays
    pictures.splice(0, pictures.length, ...newPictures);
    pages.splice(0, pages.length, ...newPages);
    
    // Force a UI update
    set(pagesVersionAtom, v => v + 1);
    set(pageAtom, 0);  // Navigate to cover page
  }
);

// In the UI component, add this at the top
export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [pagesVersion] = useAtom(pagesVersionAtom);  // This forces re-render when pages change

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        <div className="flex justify-between items-center">
          <a
            className="pointer-events-auto mt-10 ml-10"
            href="https://lessons.wawasensei.dev/courses/react-three-fiber"
          >
            <img className="w-20" src="/images/pixelpoplogo.png" />
          </a>
          {/* The ImageUploader component will be rendered outside this div */}
        </div>
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
            <button
              className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
          </div>
        </div>
      </main>

      {/* Add the ImageUploader component */}
      <ImageUploader />

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              Pixel Pop!!
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              Pop
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Your
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Memories
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              in
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              Pixels!!
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              Pixel Pop!!
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              Pop
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Your
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Memories
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              in
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              Pixels!!
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
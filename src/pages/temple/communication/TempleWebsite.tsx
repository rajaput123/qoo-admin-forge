import TempleWebsitePreview from "@/components/communication/TempleWebsitePreview";

const defaultTheme = {
  colorScheme: "saffron",
  fontStyle: "modern",
  heroTagline: "Experience divine blessings at the abode of Lord Venkateswara",
  welcomeMessage: "Om Namo Venkatesaya — Welcome to the sacred hills of Tirumala",
  sections: {
    about: true,
    timings: true,
    gallery: true,
    donations: true,
    contact: true,
    sevas: true,
    events: true,
  },
};

const TempleWebsite = () => {
  return (
    <div className="min-h-screen">
      <TempleWebsitePreview theme={defaultTheme} />
    </div>
  );
};

export default TempleWebsite;

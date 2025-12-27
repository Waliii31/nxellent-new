const SecurityByDesign = () => {
  const items = [
    { text: "Ephemeral scans,\nno code stored" },
    { text: "Independent scoring rules,\ntransparent categories" },
    { text: "Investors and founders see\nthe same results" },
  ];

  return (
    <section className="bg-[#000124] text-white py-14 mb-16 text-center">
      <h2 className="anybody  text-4xl font-bold mb-6">Security By Design</h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-16">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1 max-w-[260px]">
            <img src="/shield.svg" alt="" />
            <p className="alexandria text-gray-300 text-sm whitespace-pre-line leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SecurityByDesign;

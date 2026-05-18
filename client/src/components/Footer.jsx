function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <p className="font-bold">ShopBy</p>
        <p className="mt-1 text-sm text-stone-500">Curated products. Seamless shopping.</p>
        <p className="mt-4 text-xs text-stone-400">&copy; {new Date().getFullYear()} ShopBy</p>
      </div>
    </footer>
  );
}

export default Footer;

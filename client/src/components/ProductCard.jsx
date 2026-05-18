import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{product.category}</span>
        <h3 className="mt-1 font-semibold leading-snug">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price?.toFixed(2)}</span>
          {product.rating > 0 && <span className="text-sm text-stone-500">★ {product.rating.toFixed(1)}</span>}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

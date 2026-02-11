import { useEffect, useState } from 'react'
import api from '../api'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [banners, setBanners] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const resProducts = await api.get('/products/get-products')
      const resBanners = await api.get('/banners')

      setProducts(resProducts.data.products.filter((p) => p.type === 'product'))
      setBanners(resBanners.data.banners)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    alert('Added to cart')
  }

  return (
    <>
      {/* Banner Carousel */}
      {banners.length > 0 && (
        <div
          id="bannerCarousel"
          className="carousel slide mb-4"
          data-bs-ride="carousel"
          data-bs-interval="2000"
        >
          <div className="carousel-inner">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <Link to={`/category/${banner.redirectCategory}`}>
                  <img
                    src={banner.url}
                    className="d-block w-100"
                    alt={banner.title?.shortTitle || 'Banner'}
                    style={{
                      height: '400px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 text-center">
                <img
                  src={product.url}
                  className="card-img-top"
                  alt={product.title?.shortTitle || 'Product'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5>{product.title?.shortTitle}</h5>
                  <p className="text-muted small">
                    MRP: ₹{product.price?.mrp ?? 'N/A'} | Discount:{' '}
                    {product.price?.discount ?? 0}%
                  </p>
                  <div className="mt-auto d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product._id}`}>
                      <button className="btn btn-sm btn-outline-primary">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home

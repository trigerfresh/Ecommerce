import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const DownloadInvoicePage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const link = document.createElement('a')

    // Backend is on localhost:4000
    link.href = `http://localhost:4000/api/orders/invoice/${orderId}`
    link.download = `invoice_${orderId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 1000)

    return () => clearTimeout(timer)
  }, [orderId, navigate])

  return <p className="text-center my-4">Preparing your invoice…</p>
}

export default DownloadInvoicePage

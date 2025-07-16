const OrderModel = require("../models/Order.model.js")
const ProductModel = require("../models/Product.model.js")
const UserModel = require("../models/User.model.js")

const getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments()
    const totalProducts = await ProductModel.countDocuments()
    const salesData = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ])

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0
    }

    const analyticsData = {
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue
    }

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    const dailySalesData = await getDailySalesData(startDate, endDate)

    return res.json({
      analyticsData,
      dailySalesData
    })
  } catch (error) {
    console.log(`error in getAnalyticsData`, error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  

    const dateArr = getDatesInRange(startDate, endDate)

    return dateArr.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date)
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0
      }
    })
  } catch (error) {
    console.log(`error in getDailySalesData`, error)
  }
}

const getDatesInRange = (startDate, endDate) => {
  const dates = []
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}

module.exports = {
  getAnalyticsData,
  getDailySalesData,
  getDatesInRange
}

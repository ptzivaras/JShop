export default function OrderTrackingTimeline({ status }) {
  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
  const statusLabels = {
    PENDING: "Order Placed",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const getStatusIndex = () => {
    if (status === "CANCELLED") return -1;
    return statuses.indexOf(status || "PENDING");
  };

  const currentIndex = getStatusIndex();

  if (status === "CANCELLED") {
    return (
      <div className="px-6 py-4 bg-red-50 border-t">
        <p className="text-red-700 font-medium">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-t bg-gray-50">
      <div className="flex items-center justify-between">
        {statuses.map((s, index) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition ${
                index <= currentIndex
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {index <= currentIndex ? "✓" : index + 1}
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center">
              {statusLabels[s]}
            </p>
            {index < statuses.length - 1 && (
              <div
                className={`w-12 h-1 mt-3 transition ${
                  index < currentIndex ? "bg-indigo-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

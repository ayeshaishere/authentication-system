export function AuthLayout({ children, title, subtitle, isLeftSide = false }) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div
        className={`relative flex items-center justify-center p-8 ${
          isLeftSide ? "order-first" : "order-last lg:order-first"
        }`}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center space-y-6 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-xl opacity-90">{subtitle}</p>}
        </div>
        {/* Abstract pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="mx-auto w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  )
}

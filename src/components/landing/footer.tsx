export function SiteFooter() {
  return (
    <footer id="contact" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-black flex flex-col md:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} Hafrin Coffee</p>
        <div className="flex items-center gap-6 text-black">
          <a href="https://www.instagram.com/hafrin.coffeee/" aria-label="@hafrin.coffee on Instagram">
            @hafrin.coffeee
          </a>
          <a href="https://www.tiktok.com/@hafrin.coffee" aria-label="@hafrin.coffee on Tiktok">
            @hafrin.coffee
          </a>
        </div>
      </div>
    </footer>
  )
}

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} Hafrin Coffee</p>
        <div className="flex items-center gap-6">
          <a href="#" aria-label="@hafrin.coffee on Instagram">
            @hafrin.coffeee
          </a>
          <a href="#" aria-label="@hafrin.coffee on X">
            @hafrin.coffee
          </a>
        </div>
      </div>
    </footer>
  )
}

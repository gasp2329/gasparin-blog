export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-3xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} The Gasparin Blog. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted">
          <a href="/rss" className="hover:text-foreground transition-colors">RSS</a>
          <a href="#" className="hover:text-foreground transition-colors">X / Twitter</a>
        </div>
      </div>
    </footer>
  );
}

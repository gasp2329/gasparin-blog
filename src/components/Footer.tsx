export default function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-2xl px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} The Gasparin Blog. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted">
          <a href="/rss" className="hover:text-foreground transition-colors">RSS</a>
          <a href="#" className="hover:text-foreground transition-colors">X / Twitter</a>
        </div>
      </div>
    </footer>
  );
}

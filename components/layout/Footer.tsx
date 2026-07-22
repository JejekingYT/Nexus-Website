export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-gray-400">
      <p>
        © {new Date().getFullYear()} Nexus. All rights reserved.
      </p>
    </footer>
  );
}
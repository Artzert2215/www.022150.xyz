class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <header id="header">
        <q>Visit <a href="https://www.022150.xyz/">www.022150.xyz</a> today!</q>
        <hr>
        <nav>
            <ul>
                <li><a href="./index.html">Home</a></li>
                <li><a href="./document.html">Documents</a></li>
            </ul>
        </nav>
    </header>
    `;
  }
}
customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <footer id="footer">
        <p><b>Built without ads or trackers.</b></p>
        <nav>
            <ul>
                <li><a href="https://github.com/Artzert2215/www.022150.xyz">View Source Code</a></li>
                <li><a href="#" onclick="this.href = \`${window.location.pathname}?raw=true${window.location.hash}\`">View Raw Page</a></li>
                <li><a href="#" onclick="window.print();">Print Page Contents</a></li>
            </ul>
        </nav>
        <small>Last update: 30 May 2026</small>
    </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);
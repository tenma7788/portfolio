// Matrix Background Animation
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.mouseOffset = 0; // -1 (left) to 1 (right)

        this.init();
        this.animate();
        this.addMouseMoveListener();
    }

    addMouseMoveListener() {
        // Add mouse move listener to the canvas
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / this.canvas.width;
            this.mouseOffset = (percent - 0.5) * 2; // -1 (left) to 1 (right)
            console.log('Mouse move detected, offset:', this.mouseOffset);
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseOffset = 0;
            console.log('Mouse left canvas');
        });
        
        this.canvas.addEventListener('mouseenter', () => {
            console.log('Mouse entered canvas');
        });
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = new Array(this.columns).fill(1);
        });
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px monospace`;

        // Calculate horizontal offset in pixels (max 2 fontSize left/right)
        const maxOffset = this.fontSize * 2;
        const offset = this.mouseOffset * maxOffset;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            // Apply the offset to the x position
            this.ctx.fillText(text, i * this.fontSize + offset, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Terminal Command Handler
class Terminal {
    constructor() {
        this.input = document.getElementById('terminalInput');
        this.output = document.getElementById('terminalOutput');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'about': this.showAbout.bind(this),
            'experience': this.showExperience.bind(this),
            'skills': this.showSkills.bind(this),
            'projects': this.showProjects.bind(this),
            'blog': this.showBlog.bind(this),
            'blogs': this.showBlog.bind(this),
            'contact': this.showContact.bind(this),
            'clear': this.clearTerminal.bind(this),
            'exit': this.exitTerminal.bind(this),
            'whoami': this.whoami.bind(this),
            'ls': this.listFiles.bind(this),
            'cat': this.catFile.bind(this),
            'pwd': this.pwd.bind(this),
            'date': this.date.bind(this),
            'neofetch': this.neofetch.bind(this),
            'profiles': this.showProfiles.bind(this),
            'reviews': this.showSecurityReviews.bind(this)
        };
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
        
        this.input.focus();

        // Add event delegation for blog links ONCE
        const output = document.getElementById('terminalOutput');
        if (output) {
            output.addEventListener('click', (e) => {
                const link = e.target.closest('.blog-link');
                if (link) {
                    e.preventDefault();
                    this.showBlog([link.dataset.slug]);
                }
            });
        }
    }
    
    executeCommand() {
        const command = this.input.value.trim().toLowerCase();
        this.input.value = '';
        
        if (command === '') return;
        
        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addOutputLine(`<span class="prompt">kenzo@whitehat:~$</span><span class="command">${command}</span>`);
        
        // Execute command
        const [cmd, ...args] = command.split(' ');
        
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.addOutputLine(`<span class="output">Command not found: ${cmd}. Type 'help' for available commands.</span>`);
        }
        
        this.scrollToBottom();
    }
    
    addOutputLine(content) {
        const line = document.createElement('div');
        line.className = 'output-line';
        line.innerHTML = content;
        this.output.appendChild(line);
    }
    
    scrollToBottom() {
        // Scroll the parent .terminal-body so the input is always visible
        const terminalBody = this.output.closest('.terminal-body');
        if (terminalBody) {
            setTimeout(() => {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 0);
        }
    }
    
    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = '';
        }
        
        // Move cursor to end
        this.input.setSelectionRange(this.input.value.length, this.input.value.length);
    }
    
    // Command implementations
    showHelp() {
        this.addOutputLine('<span class="output">Available commands:</span>');
        this.addOutputLine('<span class="output">├── about - About me and my background</span>');
        this.addOutputLine('<span class="output">├── experience - Work experience and timeline</span>');
        this.addOutputLine('<span class="output">├── skills - Technical skills and certifications</span>');
        this.addOutputLine('<span class="output">├── blog - Security articles and writeups</span>');
        this.addOutputLine('<span class="output">├── contact - Get in touch</span>');
        this.addOutputLine('<span class="output">├── clear - Clear terminal</span>');
        this.addOutputLine('<span class="output">├── exit - Close terminal</span>');
        this.addOutputLine('<span class="output">├── whoami - Show current user</span>');
        this.addOutputLine('<span class="output">├── ls - List files</span>');
        this.addOutputLine('<span class="output">├── cat - Display file contents</span>');
        this.addOutputLine('<span class="output">├── pwd - Print working directory</span>');
        this.addOutputLine('<span class="output">├── date - Show current date</span>');
        this.addOutputLine('<span class="output">└── neofetch - System information</span>');
    }
    
    showAbout() {
        this.addOutputLine('<span class="output">Opening about.txt...</span>');
        setTimeout(() => {
            this.openSection('about-content');
        }, 500);
    }
    
    showExperience() {
        this.addOutputLine('<span class="output">Opening experience.txt...</span>');
        setTimeout(() => {
            this.openSection('experience-content');
        }, 500);
    }
    
    showSkills() {
        this.addOutputLine('<span class="output">Opening skills.txt...</span>');
        setTimeout(() => {
            this.openSection('skills-content');
        }, 500);
    }
    
    showProjects() {
        this.addOutputLine('<span class="output">Opening projects.txt...</span>');
        setTimeout(() => {
            this.openSection('projects-content');
        }, 500);
    }
    
    // --- BLOG MARKDOWN SUPPORT ---
    blogPosts = [
        { slug: 'hello-world', title: 'Hello World', file: 'blogs/hello-world.md' },
        { slug: 'immunefi-hack1', title: 'Immunefi Hack Analysis', file: 'blogs/immunefi_hack1.md' }
        // Add more posts here as needed
    ];

    showBlog(args) {
        if (!args || args.length === 0 || args[0] === 'list') {
            // List all blog posts
            this.addOutputLine('<span class="output">Available blog posts:</span>');
            this.blogPosts.forEach(post => {
                this.addOutputLine(`<span class="output">├── <a href="#" class="blog-link" data-slug="${post.slug}">${post.title}</a></span>`);
            });
            this.addOutputLine('<span class="output">Type <b>blog &lt;slug&gt;</b> to read a post.</span>');
            return;
        }
        // Show a specific blog post
        const slug = args[0];
        const post = this.blogPosts.find(p => p.slug === slug);
        if (!post) {
            this.addOutputLine(`<span class="output">No blog post found for slug: ${slug}</span>`);
            return;
        }
        this.addOutputLine(`<span class="output">Opening blog: ${post.title}...</span>`);
        fetch(post.file)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.text();
            })
            .then(md => {
                // Render markdown to HTML
                const html = window.marked ? window.marked.parse(md) : md;
                // Insert into blog-content section
                const section = document.getElementById('blog-content');
                if (section) {
                    section.querySelector('.section-content').innerHTML = html;
                    this.openSection('blog-content');
                }
            })
            .catch(() => {
                this.addOutputLine(`<span class="output">Failed to load blog post: ${slug}</span>`);
            });
    }
    
    showContact() {
        this.addOutputLine('<span class="output">Opening contact.txt...</span>');
        setTimeout(() => {
            this.openSection('contact-content');
        }, 500);
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
    }
    
    exitTerminal() {
        this.addOutputLine('<span class="output">Goodbye! Closing terminal...</span>');
        setTimeout(() => {
            window.close();
        }, 1000);
    }
    
    async whoami() {
        this.addOutputLine('<span class="output">Fetching your information...</span>');
        
        try {
            // Fetch IP address from a public API
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this.addOutputLine(`<span class="output">Your IP: ${data.ip}</span>`);
            
            // Optionally, get more detailed info
            const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
            const geoData = await geoResponse.json();
            
            if (geoData.city && geoData.country_name) {
                this.addOutputLine(`<span class="output">Your Location: ${geoData.city}, ${geoData.country_name}</span>`);
            }
            if (geoData.org) {
                this.addOutputLine(`<span class="output">Your ISP: ${geoData.org}</span>`);
            }
        } catch (error) {
            this.addOutputLine('<span class="output">Could not fetch your information</span>');
            console.error('Error fetching IP:', error);
        }
    }
    
    listFiles(args) {
        if (args.includes('-la') || args.includes('-a')) {
            this.addOutputLine('<span class="output">total 8</span>');
            this.addOutputLine('<span class="output">drwxr-xr-x  2 kenzo kenzo 4096 Dec 15 10:30 .</span>');
            this.addOutputLine('<span class="output">drwxr-xr-x  3 kenzo kenzo 4096 Dec 15 10:30 ..</span>');
            this.addOutputLine('<span class="output">-rw-r--r--  1 kenzo kenzo  256 Dec 15 10:30 about.txt</span>');
            this.addOutputLine('<span class="output">-rw-r--r--  1 kenzo kenzo  512 Dec 15 10:30 experience.txt</span>');
            this.addOutputLine('<span class="output">-rw-r--r--  1 kenzo kenzo  384 Dec 15 10:30 projects.txt</span>');
            this.addOutputLine('<span class="output">-rw-r--r--  1 kenzo kenzo  128 Dec 15 10:30 contact.txt</span>');
        } else {
            this.addOutputLine('<span class="output">about.txt  experience.txt  projects.txt  contact.txt</span>');
        }
    }
    
    catFile(args) {
        const file = args[0];
        if (!file) {
            this.addOutputLine('<span class="output">Usage: cat [filename]</span>');
            return;
        }
        
        switch (file) {
            case 'about.txt':
                this.addOutputLine('<span class="output">Blockchain Offensive Security Researcher</span>');
                this.addOutputLine('<span class="output">Specialized in smart contract auditing and DeFi security</span>');
                this.addOutputLine('<span class="output">Type "about" to view full profile</span>');
                break;
            case 'experience.txt':
                this.addOutputLine('<span class="output">Senior Blockchain Security Researcher (2022-Present)</span>');
                this.addOutputLine('<span class="output">Penetration Tester (2020-2022)</span>');
                this.addOutputLine('<span class="output">Security Analyst (2018-2020)</span>');
                this.addOutputLine('<span class="output">Type "experience" to view detailed timeline</span>');
                break;
            case 'projects.txt':
                this.addOutputLine('<span class="output">Smart Contract Vulnerability Scanner</span>');
                this.addOutputLine('<span class="output">MEV Bot Detection System</span>');
                this.addOutputLine('<span class="output">Cross-Chain Bridge Security Framework</span>');
                this.addOutputLine('<span class="output">Type "projects" to view detailed projects</span>');
                break;
            case 'contact.txt':
                this.addOutputLine('<span class="output">Email: your.email@example.com</span>');
                this.addOutputLine('<span class="output">Twitter: @YourTwitterHandle</span>');
                this.addOutputLine('<span class="output">GitHub: github.com/YourUsername</span>');
                this.addOutputLine('<span class="output">Type "contact" to view full contact info</span>');
                break;
            default:
                this.addOutputLine(`<span class="output">cat: ${file}: No such file or directory</span>`);
        }
    }
    
    pwd() {
        this.addOutputLine('<span class="output">/home/kenzo/whitehat</span>');
    }
    
    date() {
        const now = new Date();
        this.addOutputLine(`<span class="output">${now.toLocaleDateString()} ${now.toLocaleTimeString()}</span>`);
    }
    
    neofetch() {
        this.addOutputLine('<span class="output">                    kenzo@whitehat</span>');
        this.addOutputLine('<span class="output">                   -------------------</span>');
        this.addOutputLine('<span class="output">OS: Blockchain Security Researcher</span>');
        this.addOutputLine('<span class="output">Kernel: Smart Contract Auditor</span>');
        this.addOutputLine('<span class="output">Shell: DeFi Security Expert</span>');
        this.addOutputLine('<span class="output">Terminal: Offensive Security</span>');
        this.addOutputLine('<span class="output">CPU: Solidity, Vyper, Python</span>');
        this.addOutputLine('<span class="output">Memory: 50+ Smart Contract Audits</span>');
        this.addOutputLine('<span class="output">Disk: 100+ Penetration Tests</span>');
        this.addOutputLine('<span class="output">Packages: OSCP, OSCE, CISSP</span>');
    }
    
    showProfiles() {
        this.addOutputLine('<span class="output">My Security Researcher Profiles:</span>');
        this.addOutputLine('<span class="output">├── <a href="https://cantina.xyz/" target="_blank" rel="noopener noreferrer" style="color:#00ff00;text-decoration:underline;">Cantina</a></span>');
        this.addOutputLine('<span class="output">├── <a href="https://sherlock.xyz/" target="_blank" rel="noopener noreferrer" style="color:#00ff00;text-decoration:underline;">Sherlock</a></span>');
        this.addOutputLine('<span class="output">└── <a href="https://immunefi.com/" target="_blank" rel="noopener noreferrer" style="color:#00ff00;text-decoration:underline;">Immunefi</a></span>');
    }
    
    showSecurityReviews() {
        this.addOutputLine('<span class="output">My Security Review Portfolios:</span>');
        this.addOutputLine('<span class="output">├── <a href="https://cantina.xyz/reviews" target="_blank" rel="noopener noreferrer" style="color:#00ff00;text-decoration:underline;">Cantina Reviews</a></span>');
        this.addOutputLine('<span class="output">├── <a href="https://sherlock.xyz/reviews" target="_blank" rel="noopener noreferrer" style="color:#00ff00;text-decoration:underline;">Sherlock Reviews</a></span>');
        this.addOutputLine('<span class="output">└── <a href="https://immunefi.com/researchers" target="_blank" rel="noopener noreferrer" style="color:#00ff00;text-decoration:underline;">Immunefi Reviews</a></span>');
    }
    
    openSection(sectionId) {
        // Close all sections first
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Open the requested section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    }
}

// Content Section Manager
class ContentManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Add click handlers for close buttons
        document.querySelectorAll('.close-section').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.closest('.content-section');
                if (section) {
                    section.classList.remove('active');
                }
            });
        });
        
        // Close sections when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-section')) {
                e.target.classList.remove('active');
            }
        });
        
        // Close sections with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
            }
        });
    }
}

// Global function for closing sections (used in HTML)
function closeSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('active');
    }
}

// Web3 Hacks Ticker Manager
class Web3HacksTicker {
    constructor() {
        this.tickerContent = document.getElementById('tickerContent');
        this.hackData = [];
        this.fallbackData = [
            '🚨 BREAKING: $50M drained from DeFi protocol via flash loan attack',
            '⚠️ Smart contract vulnerability discovered in popular NFT marketplace',
            '🔥 Cross-chain bridge exploited for $25M using signature replay attack',
            '💀 Reentrancy bug leads to $15M loss in yield farming protocol',
            '🎯 Oracle manipulation attack nets hacker $8M from lending platform',
            '⛔ Governance token exploit allows attacker to drain treasury',
            '🚨 Private key compromise leads to $30M theft from multi-sig wallet',
            '⚠️ MEV bot sandwich attack causes $2M in user losses'
        ];
        
        this.init();
    }

    async init() {
        await this.fetchHackData();
        this.updateTicker();
        // Refresh data every 10 minutes
        setInterval(() => this.fetchHackData(), 600000);
    }

    async fetchHackData() {
        try {
            // Try multiple sources for Web3 security incidents
            const sources = [
                this.fetchFromRekt(),
                this.fetchFromCryptoNews(),
                this.fetchFromDefillama()
            ];

            const results = await Promise.allSettled(sources);
            let allHacks = [];

            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value.length > 0) {
                    allHacks = allHacks.concat(result.value);
                }
            });

            if (allHacks.length > 0) {
                this.hackData = allHacks.slice(0, 10); // Keep latest 10
                console.log('Fetched', this.hackData.length, 'hack incidents');
            } else {
                console.log('Using fallback data');
                this.hackData = this.fallbackData;
            }
        } catch (error) {
            console.error('Error fetching hack data:', error);
            this.hackData = this.fallbackData;
        }
    }

    async fetchFromRekt() {
        try {
            // Rekt.news API (if available) or scrape recent incidents
            const response = await fetch('https://api.rekt.news/v1/posts?limit=5');
            if (!response.ok) throw new Error('Rekt API failed');
            
            const data = await response.json();
            return data.posts.map(post => 
                `🚨 REKT: ${post.title} - ${this.formatAmount(post.fundsLost || 0)}M lost`
            );
        } catch (error) {
            return [];
        }
    }

    async fetchFromCryptoNews() {
        try {
            // CoinGecko or similar API for security-related news
            const response = await fetch('https://api.coingecko.com/api/v3/news?categories=security');
            if (!response.ok) throw new Error('CoinGecko API failed');
            
            const data = await response.json();
            return data.data.slice(0, 3).map(article => 
                `⚠️ ${article.title.substring(0, 80)}...`
            );
        } catch (error) {
            return [];
        }
    }

    async fetchFromDefillama() {
        try {
            // DefiLlama hacks API
            const response = await fetch('https://api.llama.fi/hacks');
            if (!response.ok) throw new Error('DefiLlama API failed');
            
            const data = await response.json();
            const recentHacks = data.slice(0, 5);
            
            return recentHacks.map(hack => {
                const amount = this.formatAmount(hack.amount || 0);
                const protocol = hack.name || 'Unknown Protocol';
                const emoji = this.getHackEmoji(hack.classification);
                return `${emoji} ${protocol} exploited for ${amount}M - ${hack.technique || 'Unknown method'}`;
            });
        } catch (error) {
            return [];
        }
    }

    formatAmount(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1);
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        }
        return amount.toString();
    }

    getHackEmoji(classification) {
        const emojiMap = {
            'flash-loan': '⚡',
            'reentrancy': '🔄',
            'oracle': '🔮',
            'governance': '🗳️',
            'bridge': '🌉',
            'private-key': '🔑',
            'smart-contract': '📜',
            'default': '🚨'
        };
        return emojiMap[classification] || emojiMap.default;
    }

    updateTicker() {
        if (this.hackData.length === 0) return;

        // Clear existing content
        this.tickerContent.innerHTML = '';

        // Create ticker items
        this.hackData.forEach(hack => {
            const span = document.createElement('span');
            span.className = 'ticker-item';
            span.textContent = hack;
            this.tickerContent.appendChild(span);
        });

        // Duplicate content for seamless loop
        this.hackData.forEach(hack => {
            const span = document.createElement('span');
            span.className = 'ticker-item';
            span.textContent = hack;
            this.tickerContent.appendChild(span);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start matrix background
    new MatrixBackground();
    
    // Initialize terminal
    new Terminal();
    
    // Initialize content manager
    new ContentManager();

    // Initialize Web3 hacks ticker
    new Web3HacksTicker();
    
    // Add some initial delay for dramatic effect
    setTimeout(() => {
        document.querySelector('.terminal-container').style.opacity = '1';
    }, 500);

    // Improved event delegation for links in terminal output
    const terminalOutput = document.getElementById('terminalOutput');
    if (terminalOutput) {
        terminalOutput.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            // Prevent new tab for blog-link
            if (link && this.contains(link) && !link.classList.contains('blog-link')) {
                e.preventDefault();
                window.open(link.href, '_blank', 'noopener,noreferrer');
            }
        });
    }
});
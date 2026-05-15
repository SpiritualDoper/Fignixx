(function() {
    const savedTheme = localStorage.getItem('fignix-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();
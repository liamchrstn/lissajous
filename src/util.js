export function toggleSingleCurve() {
    const sections = document.querySelectorAll('.collapsible-section, #single-curve');
    const button = document.getElementById('toggleSingleCurve');
    const isCollapsed = sections[0].classList.contains('collapsed');
    
    sections.forEach(section => {
        if (isCollapsed) {
            section.classList.remove('collapsed');
        } else {
            section.classList.add('collapsed');
        }
    });
    
    if (isCollapsed) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

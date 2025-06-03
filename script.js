// Mind map data
const data = {
    name: "AI",
    children: [{
            name: "Pembukaan",
            id: "pembukaan",
            children: []
        },
        {
            name: "Pengenalan",
            id: "pengenalan",
            children: []
        },
        {
            name: "Penggunaan",
            children: [{
                    name: "Bahasa",
                    id: "bahasa",
                    children: []
                },
                {
                    name: "Materi",
                    id: "ide",
                    children: []
                },
                {
                    name: "Teknis",
                    id: "teknis",
                    children: []
                },
                {
                    name: "Website",
                    id: "website",
                    children: []
                },
                {
                    name: "Quiz",
                    id: "quiz",
                    children: []
                }
            ]
        },
        {
            name: "Etika",
            id: "tips",
            children: []
        },
        {
            name: "Penutup",
            id: "penutup",
            children: []
        }
    ]
};

// Initialize the mind map
document.addEventListener('DOMContentLoaded', function () {
    // Start button event
    document.getElementById('start-btn').addEventListener('click', function () {
        document.getElementById('intro-panel').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('intro-panel').style.display = 'none';
            initMindMap();
        }, 500);
    });

    // Control buttons
    document.getElementById('zoom-in').addEventListener('click', zoomIn);
    document.getElementById('zoom-out').addEventListener('click', zoomOut);
    document.getElementById('reset').addEventListener('click', resetView);

    // Close overlay when clicked
    document.getElementById('overlay').addEventListener('click', closePanel);
});

let svg, g, zoom;

function initMindMap() {
    // Set dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Determine if we're on mobile
    const isMobile = width < 768;

    // Create the SVG container
    svg = d3.select("#mindmap-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a group for the mind map
    g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Define zoom behavior
    zoom = d3.zoom()
        .scaleExtent([0.1, 3])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Create a hierarchy from the data
    const root = d3.hierarchy(data);

    // Determine the layout based on device
    if (isMobile) {
        // For mobile: Use a vertical tree layout with more spacing
        createVerticalLayout(root, width, height);
    } else {
        // For desktop: Use a horizontal tree layout
        createHorizontalLayout(root, width, height);
    }

    // Center the view
    resetView();

    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';
}

function createVerticalLayout(root, width, height) {
    // For mobile, we use a top-to-bottom tree layout
    const treeLayout = d3.tree()
        .size([width * 0.8, height * 0.6])
        .separation((a, b) => {
            // Increase separation between nodes
            return (a.parent === b.parent ? 1.5 : 2.5);
        });

    // Apply the layout
    treeLayout(root);

    // Create links
    const links = g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    // Create nodes
    const nodes = g.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .on("click", (event, d) => {
            event.stopPropagation();
            if (d.data.id) {
                openPanel(d.data.id);
            }

            // Zoom to the clicked node
            if (!d.data.id) return;

            const scale = 1.5;
            const x = -d.x * scale + width / 2;
            const y = -d.y * scale + height / 2;

            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                    .translate(x, y)
                    .scale(scale)
                );
        });

    // Add circles to nodes
    nodes.append("circle")
        .attr("r", d => d.data.name === "AI di Educourse.id" ? 12 : 8)
        .style("fill", d => d.data.name === "AI di Educourse.id" ? "#4338ca" : "#4f46e5");

    // Add text backgrounds for better readability
    nodes.append("rect")
        .attr("class", "node-label-bg")
        .attr("x", -5)
        .attr("y", 10)
        .attr("width", d => d.data.name.length * 6 + 10)
        .attr("height", 20)
        .attr("opacity", 0.8);

    // Add labels to nodes
    nodes.append("text")
        .attr("dy", "2em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name);

    // Add pulsing effect to the root node
    nodes.filter(d => d.data.name === "AI di Educourse.id")
        .select("circle")
        .classed("animated-icon", true);
}

function createHorizontalLayout(root, width, height) {
    // For desktop, we use a left-to-right tree layout
    const treeLayout = d3.tree()
        .size([height * 0.8, width * 0.4])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

    // Apply the layout
    treeLayout(root);

    // Create links
    const links = g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Create nodes
    const nodes = g.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y}, ${d.x})`)
        .on("click", (event, d) => {
            event.stopPropagation();
            if (d.data.id) {
                openPanel(d.data.id);
            }

            // Zoom to the clicked node
            if (!d.data.id) return;

            const scale = 1.5;
            const x = -d.y * scale + width / 2;
            const y = -d.x * scale + height / 2;

            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                    .translate(x, y)
                    .scale(scale)
                );
        });

    // Add circles to nodes
    nodes.append("circle")
        .attr("r", d => d.data.name === "AI di Educourse.id" ? 15 : 10)
        .style("fill", d => d.data.name === "AI di Educourse.id" ? "#4338ca" : "#4f46e5");

    // Add labels to nodes
    nodes.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -15 : 15)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);

    // Add pulsing effect to the root node
    nodes.filter(d => d.data.name === "AI di Educourse.id")
        .select("circle")
        .classed("animated-icon", true);
}

function openPanel(id) {
    const panel = document.getElementById(`panel-${id}`);
    const overlay = document.getElementById('overlay');

    if (panel) {
        panel.classList.add('active');
        overlay.classList.add('active');
    }
}

function closePanel() {
    const panels = document.querySelectorAll('.detail-panel');
    const overlay = document.getElementById('overlay');

    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    overlay.classList.remove('active');
}

function zoomIn() {
    svg.transition()
        .duration(300)
        .call(zoom.scaleBy, 1.3);
}

function zoomOut() {
    svg.transition()
        .duration(300)
        .call(zoom.scaleBy, 0.7);
}

function resetView() {
    if (!svg) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    // Adjust scale based on device
    const scale = isMobile ? 0.4 : 0.8;

    svg.transition()
        .duration(750)
        .call(
            zoom.transform,
            d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
        );
}

// Handle window resize
window.addEventListener('resize', function () {
    if (svg) {
        // Remove existing SVG and recreate
        d3.select("#mindmap-container svg").remove();
        initMindMap();
    }
});

// Add touch support for mobile
let touchStartX, touchStartY;

document.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

document.addEventListener('touchend', function (e) {
    if (!touchStartX || !touchStartY) return;

    const touch = e.changedTouches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;

    // If it's a small movement, it might be a tap rather than a swipe
    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        return;
    }

    // Handle swipe for panning
    if (svg) {
        const currentTransform = d3.zoomTransform(svg.node());
        const newX = currentTransform.x - diffX;
        const newY = currentTransform.y - diffY;

        svg.call(
            zoom.transform,
            d3.zoomIdentity
            .translate(newX, newY)
            .scale(currentTransform.k)
        );
    }

    touchStartX = null;
    touchStartY = null;
});
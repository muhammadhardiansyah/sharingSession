// Mind map data
const data = {
    name: "AI di Educourse.id",
    children: [{
            name: "Pembukaan",
            id: "pembukaan",
            children: []
        },
        {
            name: "Pengenalan AI",
            id: "pengenalan",
            children: []
        },
        {
            name: "Penggunaan AI",
            children: [{
                    name: "Menyederhanakan Bahasa",
                    id: "bahasa",
                    children: []
                },
                {
                    name: "Mencari Ide Materi",
                    id: "ide",
                    children: []
                },
                {
                    name: "Masalah Teknis",
                    id: "teknis",
                    children: []
                },
                {
                    name: "Website Sederhana",
                    id: "website",
                    children: []
                },
                {
                    name: "Membuat Quiz",
                    id: "quiz",
                    children: []
                }
            ]
        },
        {
            name: "Tips & Etika",
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
    const margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    };

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

    // Create a tree layout
    const tree = d3.tree()
        .size([height - margin.top - margin.bottom, width / 2 - margin.right - margin.left])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

    // Convert data to hierarchy
    const root = d3.hierarchy(data);

    // Assign positions to nodes
    tree(root);

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
            if (d.data.id) {
                openPanel(d.data.id);
            }

            // Zoom to the clicked node
            if (!d.data.id) return; // Skip if it's the root node

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

    // Center the view
    resetView();
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

    svg.transition()
        .duration(750)
        .call(
            zoom.transform,
            d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(0.8)
        );
}

// Handle window resize
window.addEventListener('resize', function () {
    if (svg) {
        svg.attr("width", window.innerWidth)
            .attr("height", window.innerHeight);
        resetView();
    }
});
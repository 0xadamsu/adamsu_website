# Adam Su's Website

A collection of web-based tools for logistics, warehouse management, and data analysis. This website hosts multiple specialized utilities designed to streamline supply chain operations and data visualization tasks.

## 🌐 Live Website

Visit the website at: [Your GitHub Pages URL will go here]

## 🛠️ Tools Available

### 1. CSV Viewer
**Location:** `csv_viewer/csv-viewer.html`

A powerful web-based tool for viewing and analyzing CSV files with advanced filtering capabilities.

#### Features
- Auto-loading of CSV files
- Interactive column-based filtering
- Search functionality within filters
- Real-time table updates
- Responsive design for mobile and desktop
- Error handling and loading indicators

#### How to Use
1. **Setup**: Place your CSV file named `TPHC_Inventory.csv` in the `csv_viewer/` directory
2. **Loading**: Open the tool in a web browser - it will auto-load the CSV file
3. **Manual Refresh**: Click "📊 Load TPHC Inventory" to refresh data
4. **Filtering**: 
   - Click the "▼" arrow in any column header
   - Use the search box to find specific values
   - Check/uncheck items to filter
   - Click "Apply" to update the table
5. **Multiple Filters**: Apply filters to multiple columns simultaneously

#### Requirements
- CSV file must be named `TPHC_Inventory.csv`
- Standard CSV format with comma-separated values
- Web server environment (may not work when opening HTML file directly)

---

### 2. Truckload Visualizer
**Location:** `truckload_visualizer/truckload-visualizer.html`

A sophisticated logistics calculator for determining pallet requirements and weight distribution for truckload shipments.

#### Features
- Multi-product support (up to 3 products)
- Automatic product code lookup from database
- Real-time calculations and validation
- Visual capacity indicators with bar charts
- Weight and pallet limit checking
- Responsive design with modern UI

#### How to Use
1. **Product Code Lookup**:
   - Enter a product code in the "Product Code" field
   - If found, "Cases per Pallet" and "Case Weight" auto-fill
   - Green "✓ Auto-filled" indicator confirms successful lookup

2. **Manual Entry** (if product code not found):
   - Enter "Cases to Order"
   - Enter "Cases per Pallet"
   - Enter "Case Weight" in pounds

3. **Reading Results**:
   - View calculated pallets and weight for each product
   - Check total pallets and weight at the bottom
   - Monitor limit indicators: ✅ Within limits or ⚠️ LIMIT EXCEEDED
   - Review visual bar chart showing capacity usage

#### Limits
- Maximum 60 pallets per truckload
- Maximum 40,000 lbs per truckload
- Supports up to 3 different products per calculation

#### Database File
- Optional: Place `ProductCodeReference.csv` in the directory
- Format: ProductCode, CasesPerPallet, CaseWeight
- Fallback: Built-in product database available if CSV not found

---

### 3. Pallet Configurator
**Location:** `pallet_configurator/pallet-configurator.html`

An advanced 3D visualization tool for calculating optimal case arrangements on standard pallets.

#### Features
- Interactive 3D visualization using Three.js
- Multiple case orientation options
- Automatic optimization for maximum fit
- Real-time calculations
- Mouse controls for 3D view manipulation
- Professional glass-morphism UI design

#### How to Use
1. **Set Case Orientation**:
   - **Standard**: Uses dimensions as entered (L×W×H)
   - **Rotated**: Swaps length and width for better fit
   - **Maximize**: Automatically chooses best orientation

2. **Enter Dimensions**:
   - Case Length, Width, Height (in inches)
   - Pallet dimensions (defaults: 48"×40"×60")

3. **Calculate**: Click "Calculate" to process configuration

4. **3D Interaction**:
   - Click and drag to rotate the 3D view
   - Brown/tan base represents the pallet
   - Blue boxes represent arranged cases
   - View updates automatically with new calculations

#### Default Settings
- Standard US pallet: 48" × 40" × 60"
- Calculations assume perfect fit (no gaps)
- Results show whole cases only

#### Requirements
- Modern browser with WebGL support
- All dimension fields must contain valid numbers

---

## 🚀 Getting Started

### For Development
1. Clone this repository
2. Serve the files using a local web server (required for CSV loading)
3. Access individual tools through their respective HTML files

### For Production
1. Deploy to any web server or GitHub Pages
2. Ensure CSV files are properly uploaded to their respective directories
3. All tools are client-side and require no server-side processing

## 📁 Project Structure

```
adamsu_website/
├── index.html                 # Main landing page
├── README.md                  # This file
├── csv_viewer/
│   ├── csv-viewer.html       # CSV viewing tool
│   ├── TPHC_Inventory.csv    # Sample inventory data
│   └── sample_data.csv       # Additional sample data
├── truckload_visualizer/
│   ├── truckload-visualizer.html    # Truckload calculation tool
│   └── ProductCodeReference.csv    # Product database
└── pallet_configurator/
    ├── pallet-configurator.html     # 3D pallet visualization tool
    ├── script.js                    # Calculation logic
    ├── style.css                    # Styling
    └── README.md                    # Tool-specific documentation
```

## 🛡️ Browser Compatibility

All tools are designed to work with modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Note: 3D visualization in Pallet Configurator requires WebGL support.

## 📊 Data Formats

### CSV Viewer
- Standard CSV format
- Comma-separated values
- Optional quoted fields
- Headers in first row

### Truckload Visualizer Product Database
```csv
ProductCode,CasesPerPallet,CaseWeight
131607,36,2.5
131608,65,1.8
```

### File Upload Note
Currently, all tools require files to be placed in their respective directories on the server. Direct file upload functionality is not implemented but could be added in future versions.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome. Feel free to:
- Report issues
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under standard usage terms.

---

Built with ❤️ for logistics and warehouse management professionals.
const excel = require('excel4node');
const path = require('path');

// Create workbook and worksheet
const wb = new excel.Workbook();
const ws = wb.addWorksheet('Test Sheet');

// Add test data
ws.cell(1, 1).string('Column 1');
ws.cell(1, 2).string('Column 2');
ws.cell(2, 1).string('Test Data 1');
ws.cell(2, 2).string('Test Data 2');

// Write to file with absolute path
const filePath = path.join(__dirname, 'outpasses.xlsx');
wb.write(filePath, (err) => {
    if (err) {
        console.error('Excel write error:', err);
    } else {
        console.log('Excel file created successfully at:', filePath);
    }
});
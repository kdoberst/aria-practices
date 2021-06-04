/*
 * This content is licensed according to the W3C Software License at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  table-sort.js
 *
 *   Desc:  Table column sorting that implements ARIA Authoring Practices
 */
'use strict';

class SortTable {
  constructor(table) {
    const headerCells = table.querySelectorAll('thead th[aria-sort]');
    headerCells.forEach((header) => {
      this.sortListener(header);
    });
  }

  sortListener(header) {
    const activationKeyCodes = [13, 32]; // keycodes that will activate the button (enter/return, space)

    header.addEventListener('keydown', (event) => {
      const keycode = event.which || event.keycode || event.keyCode;
      if (activationKeyCodes.includes(keycode)) {
        event.preventDefault();
        const header = event.target;
        this.sort(header);
      }
    });
    header.addEventListener('click', (event) => {
      const header = event.target;
      this.sort(header);
    });
  }

  sort(header) {
    const headerRow = header.closest('tr');
    const headerCell = header.closest('th');

    const columnIndex = Array.from(headerRow.querySelectorAll('th')).indexOf(
      headerCell
    );

    const isAscending = this.setSortOrder(headerCell);

    const tbody = header.closest('table').querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
      .sort(this.comparer(columnIndex, isAscending))
      .forEach((tr) => tbody.appendChild(tr));
  }

  setSortOrder(header) {
    const sortOrder =
      header.getAttribute('aria-sort') === 'ascending'
        ? 'descending'
        : 'ascending';

    Array.from(
      header.closest('tr').querySelectorAll('th[aria-sort]')
    ).forEach((header) => header.setAttribute('aria-sort', 'none'));

    header.setAttribute('aria-sort', sortOrder);
    return sortOrder === 'ascending';
  }

  getCellValue(row, index) {
    return row.children[index].innerText || row.children[index].textContent;
  }

  comparer(columnIndex, isAscending) {
    return (rowA, rowB) => {
      const cellA = this.getCellValue(rowA, columnIndex);
      const cellB = this.getCellValue(rowB, columnIndex);

      if (cellA !== '' && cellB !== '' && !isNaN(cellA) && !isNaN(cellB)) {
        // cellA and cellB are both numbers
        return isAscending ? cellA - cellB : cellB - cellA;
      }

      // treating cellA and cellB as strings
      return isAscending
        ? cellA.toString().localeCompare(cellB.toString())
        : cellB.toString().localeCompare(cellA.toString());
    };
  }
}

// Initialize sort table
window.addEventListener('load', function () {
  // Initialize the sort table on all matching DOM nodes
  Array.from(document.querySelectorAll('table[data-sort-table]')).forEach(
    (table) => new SortTable(table)
  );
});

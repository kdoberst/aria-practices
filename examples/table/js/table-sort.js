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
    const headerCells = table.querySelectorAll('thead th:not([data-no-sort]');
    headerCells.forEach((headerCell) => {
      this.addSortButton(headerCell);
    });
  }
  addSortButton(header) {
    const button = document.createElement('button');
    const buttonContent = document.createElement('span');

    while (header.firstChild) {
      buttonContent.appendChild(header.firstChild);
    }

    button.append(buttonContent);

    this.sortListener(button);
    header.append(button);
  }

  sortListener(button) {
    button.addEventListener('click', (event) => {
      const btn = event.target;

      const headerRow = btn.closest('tr');
      const headerCell = btn.closest('th');

      const columnIndex = Array.from(headerRow.querySelectorAll('th')).indexOf(
        headerCell
      );

      const isAscending = this.setSortOrder(headerCell);

      const tbody = btn.closest('table').querySelector('tbody');
      Array.from(tbody.querySelectorAll('tr'))
        .sort(this.comparer(columnIndex, isAscending))
        .forEach((tr) => tbody.appendChild(tr));
    });
  }

  setSortOrder(header) {
    const sortOrder =
      header.getAttribute('aria-sort') === 'ascending'
        ? 'descending'
        : 'ascending';

    Array.from(header.closest('tr').querySelectorAll('th')).forEach((header) =>
      header.removeAttribute('aria-sort')
    );

    header.setAttribute('aria-sort', sortOrder);
    return sortOrder === 'ascending';
  }

  getCellValue(row, index) {
    return row.children[index].innerText || row.children[index].textContent;
  }

  comparer(idx, asc) {
    return (a, b) =>
      ((v1, v2) =>
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
          ? v1 - v2
          : v1.toString().localeCompare(v2))(
        this.getCellValue(asc ? a : b, idx),
        this.getCellValue(asc ? b : a, idx)
      );
  }
}

// Initialize sort table
window.addEventListener('load', function () {
  // Initialize the sort table on all matching DOM nodes
  Array.from(document.querySelectorAll('table[data-sort-table]')).forEach(
    (table) => new SortTable(table)
  );
});

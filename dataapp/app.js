
// DB functions using localStorage
const DB = {
  init: function() {
    if (!localStorage.getItem('records')) {
      localStorage.setItem('records', JSON.stringify([
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32 },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45 }
      ]));
    }
  },
  getRecords: () => JSON.parse(localStorage.getItem('records')),
  addRecord: function(record) {
    const records = this.getRecords();
    record.id = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
    return record;
  },
  updateRecord: function(id, updated) {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...updated, id };
      localStorage.setItem('records', JSON.stringify(records));
    }
  },
  deleteRecord: function(id) {
    const records = this.getRecords().filter(r => r.id !== id);
    localStorage.setItem('records', JSON.stringify(records));
  }
};

// If on dashboard.html → bind UI
if (document.getElementById('dataForm')) {
  DB.init();

  const dataForm = document.getElementById('dataForm');
  const dataTableBody = document.getElementById('dataTableBody');
  const totalRecords = document.getElementById('totalRecords');
  const userCount = document.getElementById('userCount');
  const emailCount = document.getElementById('emailCount');
  const avgAge = document.getElementById('avgAge');

  function updateStats() {
    const records = DB.getRecords();
    totalRecords.textContent = `${records.length} record${records.length !== 1 ? 's' : ''}`;
    userCount.textContent = records.length;
    emailCount.textContent = records.length;
    avgAge.textContent = records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.age, 0) / records.length)
      : 0;
  }

  function loadDataTable() {
    const records = DB.getRecords();
    dataTableBody.innerHTML = '';
    records.forEach(r => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.age}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn btn-edit" data-id="${r.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-btn btn-delete" data-id="${r.id}"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      dataTableBody.appendChild(row);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Delete this record?')) {
          DB.deleteRecord(id);
          loadDataTable();
          updateStats();
        }
      };
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const r = DB.getRecords().find(x => x.id === id);
        if (r) {
          document.getElementById('name').value = r.name;
          document.getElementById('email').value = r.email;
          document.getElementById('age').value = r.age;
          dataForm.setAttribute('data-edit-id', id);
          dataForm.querySelector('button').innerHTML = '<i class="fas fa-sync"></i> Update Record';
        }
      };
    });
  }

  dataForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = dataForm.getAttribute('data-edit-id');
    const record = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      age: parseInt(document.getElementById('age').value)
    };
    if (id) {
      DB.updateRecord(parseInt(id), record);
      dataForm.removeAttribute('data-edit-id');
      dataForm.querySelector('button').innerHTML = '<i class="fas fa-plus"></i> Add Record';
      alert('Record updated!');
    } else {
      DB.addRecord(record);
      alert('Record added!');
    }
    dataForm.reset();
    loadDataTable();
    updateStats();
  });

  loadDataTable();
  updateStats();
}




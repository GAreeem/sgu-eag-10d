import { useEffect, useState } from 'react';
import UserController from '../../user/user.controller.js';
import AppAlert from '../common/AppAlert';

export default function UsersPage() {
  const empty = { id: null, fullName: '', email: '', phone: '' };

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await UserController.getAll();
    if (res?.success) setUsers(res.data || []);
    else setAlert({ type: 'danger', msg: res?.message || 'No se pudieron cargar los usuarios' });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setShow(true); };
  const openEdit = (u) => { setForm(u); setShow(true); };
  const close = () => setShow(false);

  const save = async () => {
    const isUpdate = !!form.id;
    const res = isUpdate
      ? await UserController.update(form)
      : await UserController.create(form);

    if (res?.success) {
      setAlert({ type: 'success', msg: isUpdate ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente' });
      close();
      load();
    } else {
      setAlert({ type: 'danger', msg: res?.message || 'Error al guardar el usuario' });
    }
  };

  const remove = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    const res = await UserController.remove(id);
    if (res?.success) {
      setAlert({ type: 'success', msg: 'Usuario eliminado exitosamente' });
      load();
    } else {
      setAlert({ type: 'danger', msg: res?.message || 'No se pudo eliminar el usuario' });
    }
  };

  return (
    <div className="app-container">
      

      {/* Alertas */}
      <AppAlert alert={alert} onClose={() => setAlert(null)} />

      {/* Contenedor de tabla */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-title">
            👥 Usuarios Registrados
          </div>

          {/* Botón NUEVO USUARIO (los botones se quedan igual) */}
          <button className="btn-modern" onClick={openNew}>
            ➕ Nuevo Usuario
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Cargando usuarios...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No hay usuarios registrados</h3>
            <p>Comienza agregando tu primer usuario al sistema</p>
            <button className="btn-modern" onClick={openNew}>
              ✨ Crear primer usuario
            </button>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <strong>#{user.id}</strong>
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => openEdit(user)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => remove(user.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {show && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {form.id ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
              </h2>
              <button className="btn-close" onClick={close}>✕</button>
            </div>
            
            <form onSubmit={e => { e.preventDefault(); save(); }}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ingresa el nombre completo"
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="usuario@ejemplo.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+52 123 456 7890"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  className="btn-action" 
                  onClick={close}
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  ❌ Cancelar
                </button>
                <button type="submit" className="btn-modern">
                  {form.id ? '💾 Actualizar' : '✨ Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

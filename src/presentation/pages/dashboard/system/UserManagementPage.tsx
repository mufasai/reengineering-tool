import { createSignal, For, Show, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColDef } from 'ag-grid-community';
import type { User } from '../../../../domain/entities/user.entity';
import { UserRepositoryImpl } from '../../../../infrastructure/repositories/user.repository.impl';
import { GetUsersInteractor } from '../../../../application/use-cases/get-users.use-case';
import { UpdateUserRoleInteractor } from '../../../../application/use-cases/update-user-role.use-case';
import { DeleteUserInteractor } from '../../../../application/use-cases/delete-user.use-case';

const UserManagementPage: Component = () => {
    const [users, setUsers] = createSignal<User[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [showEditModal, setShowEditModal] = createSignal(false);
    const [showDeleteModal, setShowDeleteModal] = createSignal(false);
    const [selectedUser, setSelectedUser] = createSignal<User | null>(null);
    const [selectedRole, setSelectedRole] = createSignal('');
    const [error, setError] = createSignal('');

    const roles = [
        { value: 'admin', label: 'Admin' },
        { value: 'management', label: 'Management' },
        { value: 'backoffice_admin', label: 'Backoffice Admin' },
        { value: 'finance', label: 'Finance' },
        { value: 'team_leader', label: 'Team Leader' },
        { value: 'engineer', label: 'Engineer' },
    ];

    onMount(() => {
        loadUsers();
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const userRepository = new UserRepositoryImpl();
            const getUsersUseCase = new GetUsersInteractor(userRepository);
            const usersData = await getUsersUseCase.execute();

            setUsers(usersData);
        } catch (err: any) {
            console.error('Failed to load users:', err);
            setError(err.message || 'Gagal memuat data user');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRole = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setShowEditModal(true);
        setError('');
    };

    const handleSaveRole = async () => {
        if (!selectedUser()) return;

        try {
            setLoading(true);
            setError('');

            const userRepository = new UserRepositoryImpl();
            const updateUserRoleUseCase = new UpdateUserRoleInteractor(userRepository);

            const updatedUser = await updateUserRoleUseCase.execute(
                selectedUser()!.id,
                {
                    name: selectedUser()!.name,
                    role: selectedRole()
                }
            );

            // Update local state
            setUsers(users().map(u =>
                u.id === updatedUser.id ? updatedUser : u
            ));

            setShowEditModal(false);
            setSelectedUser(null);
        } catch (err: any) {
            console.error('Failed to update user role:', err);
            setError(err.message || 'Gagal mengubah role user');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
        setError('');
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser()) return;

        try {
            setLoading(true);
            setError('');

            const userRepository = new UserRepositoryImpl();
            const deleteUserUseCase = new DeleteUserInteractor(userRepository);

            await deleteUserUseCase.execute(selectedUser()!.id);

            // Remove from local state
            setUsers(users().filter(u => u.id !== selectedUser()!.id));

            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            setError(err.message || 'Gagal menghapus user');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'management':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'backoffice_admin':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'finance':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'team_leader':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'engineer':
                return 'bg-slate-100 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const columns: ColDef[] = [
        {
            headerName: 'No',
            width: 80,
            valueGetter: (params) => {
                return params.node?.rowIndex != null ? params.node.rowIndex + 1 : 0;
            }
        },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            width: 180,
            cellRenderer: (params: any) => {
                const container = document.createElement('div');
                container.style.cssText = 'display: flex; align-items: center; height: 100%;';

                const badge = document.createElement('span');
                badge.textContent = params.value.replace('_', ' ').toUpperCase();
                badge.className = `px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeClass(params.value)}`;

                container.appendChild(badge);
                return container;
            }
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 180,
            valueFormatter: (params) => {
                if (!params.value) return '';
                const date = new Date(params.value);
                return date.toLocaleString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: (params: any) => {
                const container = document.createElement('div');
                container.style.cssText = 'display: flex; gap: 8px; align-items: center; justify-content: center; height: 100%;';

                // Edit button
                const editBtn = document.createElement('button');
                editBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                `;
                editBtn.style.cssText = 'background: none; border: none; cursor: pointer; color: #3b82f6; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;';
                editBtn.onmouseover = () => editBtn.style.background = '#eff6ff';
                editBtn.onmouseout = () => editBtn.style.background = 'none';
                editBtn.onclick = () => handleEditRole(params.data);

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                `;
                deleteBtn.style.cssText = 'background: none; border: none; cursor: pointer; color: #ef4444; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;';
                deleteBtn.onmouseover = () => deleteBtn.style.background = '#fef2f2';
                deleteBtn.onmouseout = () => deleteBtn.style.background = 'none';
                deleteBtn.onclick = () => handleDeleteUser(params.data);

                container.appendChild(editBtn);
                container.appendChild(deleteBtn);
                return container;
            }
        },
    ];

    return (
        <div class="space-y-6">
            {/* Header */}
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                    <p class="text-slate-500 mt-1">Kelola user dan role mereka</p>
                </div>
            </div>

            {/* Error Message */}
            <Show when={error() && !showEditModal()}>
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error()}
                </div>
            </Show>

            {/* Users Table */}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-slate-900">Daftar User</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-slate-500">Total: {users().length} users</span>
                    </div>
                </div>

                <Show
                    when={!loading()}
                    fallback={
                        <div class="p-8 text-center text-slate-500">Loading users...</div>
                    }
                >
                    <div class="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
                        <AgGridSolid
                            columnDefs={columns}
                            rowData={users()}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                        />
                    </div>
                </Show>
            </div>

            {/* Edit Role Modal */}
            <Show when={showEditModal()}>
                <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
                    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 class="text-xl font-bold text-slate-900 mb-4">Edit User Role</h2>

                        {/* Error Message in Modal */}
                        <Show when={error()}>
                            <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        </Show>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">User</label>
                                <input
                                    type="text"
                                    value={selectedUser()?.name || ''}
                                    disabled
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="text"
                                    value={selectedUser()?.email || ''}
                                    disabled
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                                <select
                                    value={selectedRole()}
                                    onChange={(e) => setSelectedRole(e.currentTarget.value)}
                                    disabled={loading()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                    <For each={roles}>
                                        {(role) => (
                                            <option value={role.value}>{role.label}</option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        </div>

                        <div class="flex gap-3 mt-6">
                            <button
                                onClick={handleSaveRole}
                                disabled={loading()}
                                class="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                {loading() ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setError('');
                                }}
                                disabled={loading()}
                                class="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </Show>

            {/* Delete Confirmation Modal */}
            <Show when={showDeleteModal()}>
                <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
                    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-slate-900">Hapus User</h2>
                                <p class="text-sm text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
                            </div>
                        </div>

                        {/* Error Message in Modal */}
                        <Show when={error()}>
                            <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        </Show>

                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                            <p class="text-sm text-slate-700 mb-2">
                                Apakah Anda yakin ingin menghapus user ini?
                            </p>
                            <div class="space-y-1">
                                <p class="text-sm font-semibold text-slate-900">{selectedUser()?.name}</p>
                                <p class="text-xs text-slate-500">{selectedUser()?.email}</p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <button
                                onClick={handleConfirmDelete}
                                disabled={loading()}
                                class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                {loading() ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setError('');
                                }}
                                disabled={loading()}
                                class="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default UserManagementPage;

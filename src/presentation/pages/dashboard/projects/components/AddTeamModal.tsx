import { createSignal, Show, For, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import type { Team } from '../../../../../domain/entities/team.entity';
import { TeamRepositoryImpl } from '../../../../../infrastructure/repositories/team.repository.impl';
import { GetTeamsInteractor } from '../../../../../application/use-cases/get-teams.use-case';

interface AddTeamModalProps {
    show: boolean;
    onClose: () => void;
    onAdd: (teamId: string) => Promise<void>;
}

const AddTeamModal: Component<AddTeamModalProps> = (props) => {
    const [teams, setTeams] = createSignal<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [submitting, setSubmitting] = createSignal(false);

    // Load teams whenever modal is shown
    createEffect(() => {
        if (props.show) {
            loadTeams();
        }
    });

    const loadTeams = async () => {
        try {
            setLoading(true);
            console.log('Starting to load teams...');
            const teamRepository = new TeamRepositoryImpl();
            const getTeamsUseCase = new GetTeamsInteractor(teamRepository);
            const teamsData = await getTeamsUseCase.execute();
            console.log('Teams loaded successfully:', teamsData);
            console.log('Number of teams:', teamsData.length);
            setTeams(teamsData);
        } catch (error) {
            console.error('Failed to load teams:', error);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const teamId = selectedTeamId();
        if (!teamId) {
            console.error('No team selected');
            return;
        }

        try {
            setSubmitting(true);
            await props.onAdd(teamId);
            setSelectedTeamId('');
            props.onClose();
        } catch (error) {
            console.error('Failed to add team:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting()) {
            setSelectedTeamId('');
            props.onClose();
        }
    };

    return (
        <Show when={props.show}>
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div class="p-6 border-b border-slate-200">
                        <h2 class="text-xl font-bold text-slate-900">Add Team to Site</h2>
                        <p class="text-sm text-slate-500 mt-1">
                            Select a team member from the master list
                        </p>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                Select Team Member
                            </label>
                            <Show when={loading()}>
                                <div class="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-500">
                                    Loading teams...
                                </div>
                            </Show>
                            <Show when={!loading()}>
                                <Show when={teams().length === 0}>
                                    <div class="w-full px-4 py-2 border border-amber-300 rounded-lg bg-amber-50 text-sm text-amber-700 mb-2">
                                        Tidak ada data teams. Silakan upload teams terlebih dahulu di menu Teams.
                                    </div>
                                </Show>
                                <select
                                    value={selectedTeamId()}
                                    onChange={(e) => setSelectedTeamId(e.currentTarget.value)}
                                    disabled={submitting() || teams().length === 0}
                                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value="">-- Pilih Team ({teams().length} tersedia) --</option>
                                    <For each={teams()}>
                                        {(team) => (
                                            <option value={team.id}>
                                                {team.nama_karyawan} - {team.jabatan_kerja} ({team.nik})
                                            </option>
                                        )}
                                    </For>
                                </select>
                            </Show>
                        </div>

                        {/* Selected Team Info */}
                        <Show when={selectedTeamId()}>
                            {() => {
                                const selectedTeam = teams().find(t => t.id === selectedTeamId());
                                return selectedTeam ? (
                                    <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                        <p class="text-xs font-semibold text-blue-900 mb-2">Team Member Details:</p>
                                        <div class="space-y-1 text-xs text-blue-700">
                                            <p><strong>Nama:</strong> {selectedTeam.nama_karyawan}</p>
                                            <p><strong>NIK:</strong> {selectedTeam.nik}</p>
                                            <p><strong>Jabatan:</strong> {selectedTeam.jabatan_kerja}</p>
                                            <p><strong>Regional:</strong> {selectedTeam.regional}</p>
                                            <p><strong>No HP:</strong> {selectedTeam.no_hp}</p>
                                        </div>
                                    </div>
                                ) : null;
                            }}
                        </Show>
                    </form>

                    {/* Footer */}
                    <div class="p-6 border-t border-slate-200 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting()}
                            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selectedTeamId() || submitting()}
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Show when={submitting()}>
                                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </Show>
                            {submitting() ? 'Adding...' : 'Add Team'}
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default AddTeamModal;

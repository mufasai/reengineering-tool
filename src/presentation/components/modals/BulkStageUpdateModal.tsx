import { Show } from 'solid-js';
import type { Component } from 'solid-js';

const BulkStageUpdateModal: Component<{ isOpen: boolean; onClose: () => void }> = (props) => {
    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-xl w-[400px] p-6 text-center">
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Bulk Update</h2>
                    <p class="text-slate-500 mb-6">Fitur Bulk Stage Update sedang dalam pengembangan.</p>
                    <button
                        onClick={props.onClose}
                        class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Show>
    );
};

export default BulkStageUpdateModal;

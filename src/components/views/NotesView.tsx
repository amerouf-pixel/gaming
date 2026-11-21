import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { TacticalNote } from '../../types';
import {
  FileText,
  Pin,
  Trash2,
  Plus,
  Search,
  Tag,
  Copy,
  Check,
  Pencil,
  X,
} from 'lucide-react';

interface NotesViewProps {
  onOpenNewItemModal: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onOpenNewItemModal }) => {
  const { notes, updateNote, deleteNote, togglePinNote } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.notes;
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline note editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const startEdit = (note: TacticalNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
  };

  const saveEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateNote(id, {
      title: editTitle.trim(),
      content: editContent,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setEditingId(null);
  };

  const filteredNotes = notes.filter((n) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback ignored in restricted contexts
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[var(--jx-accent-alt)]" />
            <h1 className="text-xl sm:text-2xl font-bold font-hud tracking-wide text-white uppercase">
              {t.title}
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{t.subtitle}</p>
        </div>

        <button
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--jx-accent)] to-[var(--jx-accent-warm)] hover:brightness-110 text-white font-hud font-bold text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newNote}</span>
        </button>
      </div>

      <div className="jitalx-panel p-3.5 rounded-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="jitalx-input w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full jitalx-panel p-10 text-center rounded-xl">
            <FileText className="w-9 h-9 text-slate-600 mx-auto mb-2.5" />
            <div className="text-slate-200 font-hud font-semibold">{t.emptyTitle}</div>
            <div className="text-xs text-slate-400 mt-1">{t.emptyDesc}</div>
          </div>
        ) : (
          sortedNotes.map((note) => {
            const isEditing = editingId === note.id;
            return (
              <div
                key={note.id}
                className={`jitalx-panel p-4 rounded-xl transition-all flex flex-col justify-between ${
                  note.pinned
                    ? 'border-[var(--jx-accent-alt)]/50 shadow-[0_0_24px_rgba(0,240,255,0.08)]'
                    : 'hover:border-[var(--jx-border-strong)]'
                }`}
              >
                {isEditing ? (
                  <form onSubmit={(e) => saveEdit(e, note.id)} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-hud font-bold text-[var(--jx-accent-alt)] uppercase tracking-wider">
                        {appCopy.common.edit}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        aria-label={appCopy.common.cancel}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder={t.titlePlaceholder}
                      className="jitalx-input w-full px-3 py-1.5 text-sm"
                    />
                    <textarea
                      rows={4}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder={t.contentPlaceholder}
                      className="jitalx-input w-full px-3 py-2 text-xs font-mono-code"
                    />
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder={t.tagsPlaceholder}
                      className="jitalx-input w-full px-3 py-1.5 text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 cursor-pointer"
                      >
                        {appCopy.common.cancel}
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-md bg-[var(--jx-accent-alt)] hover:brightness-110 text-slate-950 font-hud font-bold text-xs cursor-pointer"
                      >
                        {appCopy.common.save}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h3 className="font-hud font-bold text-base text-white leading-snug">{note.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-[var(--jx-accent-alt)] border border-white/10 cursor-pointer transition-colors"
                            title={appCopy.common.edit}
                            aria-label={appCopy.common.edit}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => togglePinNote(note.id)}
                            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                              note.pinned
                                ? 'bg-[var(--jx-accent-alt)]/15 text-[var(--jx-accent-alt)] border-[var(--jx-accent-alt)]/45'
                                : 'bg-white/[0.04] text-slate-500 border-white/10 hover:text-slate-200'
                            }`}
                            title={note.pinned ? 'Unpin' : 'Pin'}
                            aria-label={note.pinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1.5 rounded-md bg-white/[0.04] hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 border border-white/10 cursor-pointer transition-colors"
                            title={appCopy.common.delete}
                            aria-label={appCopy.common.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="jitalx-panel-deep p-3 rounded-lg font-mono-code text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </div>

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-[11px] font-mono-code text-[var(--jx-accent-alt)]/90">
                          <Tag className="w-3 h-3 text-slate-500 shrink-0" />
                          {note.tags.map((tag, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
                              <span>#{tag}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code text-slate-500">
                      <span className="tabular-nums">{note.updatedAt}</span>
                      <button
                        onClick={() => void handleCopy(note.id, note.content)}
                        className="flex items-center gap-1 text-slate-400 hover:text-[var(--jx-accent-alt)] cursor-pointer transition-colors"
                        title={locale === 'fr' ? 'Copier' : 'Copy'}
                      >
                        {copiedId === note.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">
                              {locale === 'fr' ? 'Copié !' : 'Copied!'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{locale === 'fr' ? 'Copier' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

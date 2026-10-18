import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Plus, Edit, Trash2, BookOpen, HelpCircle, Gamepad2, Search, ArrowLeft, Check, X, Upload } from 'lucide-react';

export const AdminPanel = () => {
  const { 
    currentScreen, setCurrentScreen, 
    topics, setTopics, 
    artifactItems, setArtifactItems, 
    memoryItems, setMemoryItems,
    showToast 
  } = useApp();

  const [adminSubTab, setAdminSubTab] = useState(
    currentScreen === 'admin-topics' ? 'topics' :
    currentScreen === 'admin-story' ? 'story' :
    currentScreen === 'admin-quiz' ? 'quiz' :
    currentScreen === 'admin-game' ? 'game' : 'dashboard'
  );

  const [selectedTopicIdForAdmin, setSelectedTopicIdForAdmin] = useState('warli-art');

  // Modal forms states
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    name: '', category: 'art', categoryLabel: 'Traditional Art', state: 'Maharashtra',
    shortDescription: '', coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  });

  const [chapterForm, setChapterForm] = useState({
    chapterNumber: 1, title: '', content: '', didYouKnow: '', audioScript: '', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  });

  const [quizForm, setQuizForm] = useState({
    question: '', option_a: '', option_b: '', option_c: '', option_d: '', correctAnswer: '', explanation: ''
  });

  const [gameForm, setGameForm] = useState({
    artifactName: '', artifactIcon: '🏺', targetName: '', region: 'Maharashtra', category: 'Crafts'
  });

  // Calculate total counts
  const totalChapters = topics.reduce((acc, t) => acc + (t.chapters?.length || 0), 0);
  const totalQuizQuestions = topics.reduce((acc, t) => acc + ((t.quizzes || t.quiz)?.length || 0), 0);

  // Handlers
  const handleAddTopic = (e) => {
    e.preventDefault();
    const id = newTopic.name.toLowerCase().replace(/\s+/g, '-');
    const topicObj = {
      id,
      ...newTopic,
      origin: 'Ancient Tradition',
      region: newTopic.state,
      artStyle: newTopic.categoryLabel,
      historicalBackground: newTopic.shortDescription,
      bannerImage: newTopic.coverImage,
      status: 'Active',
      relatedTraditions: ['Folk Art', 'Cultural Heritage'],
      chapters: [
        { id: 1, number: 1, title: `Introduction to ${newTopic.name}`, content: newTopic.shortDescription, didYouKnow: 'Fascinating cultural heritage fact!', imageUrl: newTopic.coverImage }
      ],
      quiz: [
        { id: 1, question: `What is ${newTopic.name}?`, options: [`A. ${newTopic.categoryLabel}`, 'B. Modern Sport', 'C. Pop Music', 'D. Movie'], correctAnswer: `A. ${newTopic.categoryLabel}`, explanation: 'Official heritage classification.' }
      ]
    };
    setTopics(prev => [...prev, topicObj]);
    setTopicModalOpen(false);
    showToast(`Added new topic: ${newTopic.name}!`);
  };

  const handleDeleteTopic = (topicId) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
    showToast('Topic deleted successfully');
  };

  const handleAddChapter = (e) => {
    e.preventDefault();
    setTopics(prev => prev.map(t => {
      if (t.id === selectedTopicIdForAdmin) {
        const nextNum = (t.chapters?.length || 0) + 1;
        return {
          ...t,
          chapters: [...(t.chapters || []), { id: nextNum, number: nextNum, ...chapterForm }]
        };
      }
      return t;
    }));
    setChapterForm({ chapterNumber: 1, title: '', content: '', didYouKnow: '', audioScript: '', imageUrl: '' });
    showToast('New story chapter added!');
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    setTopics(prev => prev.map(t => {
      if (t.id === selectedTopicIdForAdmin) {
        const nextId = (t.quiz?.length || 0) + 1;
        return {
          ...t,
          quiz: [...(t.quiz || []), {
            id: nextId,
            question: quizForm.question,
            options: [quizForm.option_a, quizForm.option_b, quizForm.option_c, quizForm.option_d],
            correctAnswer: quizForm.correctAnswer,
            explanation: quizForm.explanation
          }]
        };
      }
      return t;
    }));
    setQuizForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correctAnswer: '', explanation: '' });
    showToast('New quiz question added!');
  };

  const handleAddGameItem = (e) => {
    e.preventDefault();
    setArtifactItems(prev => [
      ...prev,
      { id: String(Date.now()), ...gameForm }
    ]);
    showToast('New artifact match item added!');
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicIdForAdmin) || topics[0];

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-100 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-cinzel text-2xl font-bold text-amber-950">Admin Panel</h1>
            <p className="text-xs text-amber-900/70 font-medium">Manage educational heritage topics, chapters, quizzes and games.</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('home')}
          className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Admin Subtabs Bar matching Screens 16, 17, 18, 19, 20 */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200/80 pb-3">
        <button
          onClick={() => setAdminSubTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminSubTab === 'dashboard' ? 'bg-amber-900 text-white' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/70'
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setAdminSubTab('topics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminSubTab === 'topics' ? 'bg-amber-900 text-white' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/70'
          }`}
        >
          🏛️ Heritage Management
        </button>
        <button
          onClick={() => setAdminSubTab('story')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminSubTab === 'story' ? 'bg-amber-900 text-white' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/70'
          }`}
        >
          📚 Story Editor
        </button>
        <button
          onClick={() => setAdminSubTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminSubTab === 'quiz' ? 'bg-amber-900 text-white' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/70'
          }`}
        >
          🧠 Quiz Management
        </button>
        <button
          onClick={() => setAdminSubTab('game')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminSubTab === 'game' ? 'bg-amber-900 text-white' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/70'
          }`}
        >
          🎮 Game Management
        </button>
      </div>

      {/* DASHBOARD TAB (Screen 16) */}
      {adminSubTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
              <span className="font-cinzel text-3xl font-extrabold text-amber-950">{topics.length}</span>
              <span className="text-xs font-bold text-amber-800 uppercase block">Heritage Topics</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
              <span className="font-cinzel text-3xl font-extrabold text-amber-950">{totalChapters}</span>
              <span className="text-xs font-bold text-amber-800 uppercase block">Story Chapters</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
              <span className="font-cinzel text-3xl font-extrabold text-amber-950">{totalQuizQuestions}</span>
              <span className="text-xs font-bold text-amber-800 uppercase block">Quiz Questions</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
              <span className="font-cinzel text-3xl font-extrabold text-amber-950">2</span>
              <span className="text-xs font-bold text-amber-800 uppercase block">Mini-Games</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-amber-950 border-b border-amber-100 pb-2">
              Recent Admin Activity Log
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 flex items-center justify-between">
                <span>Updated Warli Art chapters and audio script</span>
                <span className="text-amber-800 font-bold">2 hours ago</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 flex items-center justify-between">
                <span>Added 5 quiz questions for Ajanta Caves</span>
                <span className="text-amber-800 font-bold">5 hours ago</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 flex items-center justify-between">
                <span>Created Maratha Forts topic</span>
                <span className="text-amber-800 font-bold">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPICS TAB (Screen 17) */}
      {adminSubTab === 'topics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-xl font-bold text-amber-950">Heritage Topics List</h3>
            <button
              onClick={() => setTopicModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Heritage Topic</span>
            </button>
          </div>

          {/* Topics Table matching Screen 17 */}
          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-100/70 border-b border-amber-200 text-amber-950 font-bold uppercase">
                <tr>
                  <th className="p-4">Topic Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {topics.map((t) => (
                  <tr key={t.id} className="hover:bg-amber-50/50">
                    <td className="p-4 font-bold text-amber-950 flex items-center gap-2">
                      <img src={t.coverImage} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <span>{t.name}</span>
                    </td>
                    <td className="p-4 text-amber-900 font-medium">{t.categoryLabel}</td>
                    <td className="p-4 text-amber-900 font-medium">{t.state}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {t.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteTopic(t.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STORY EDITOR TAB (Screen 18) */}
      {adminSubTab === 'story' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-md space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
            Add / Edit Story Chapter
          </h3>

          <form onSubmit={handleAddChapter} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Select Topic</label>
              <select
                value={selectedTopicIdForAdmin}
                onChange={(e) => setSelectedTopicIdForAdmin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold"
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.state})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Chapter Title</label>
              <input
                type="text"
                required
                value={chapterForm.title}
                onChange={(e) => setChapterForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. How is Warli Art Created?"
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Story Content (Text)</label>
              <textarea
                required
                rows={4}
                value={chapterForm.content}
                onChange={(e) => setChapterForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Detailed chapter story explanation..."
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Did You Know? Tip</label>
              <input
                type="text"
                value={chapterForm.didYouKnow}
                onChange={(e) => setChapterForm(prev => ({ ...prev, didYouKnow: e.target.value }))}
                placeholder="Interesting cultural trivia..."
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-colors"
            >
              Add Story Chapter →
            </button>
          </form>
        </div>
      )}

      {/* QUIZ MANAGER TAB (Screen 19) */}
      {adminSubTab === 'quiz' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-md space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
            Add Quiz Question
          </h3>

          <form onSubmit={handleAddQuiz} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Select Topic</label>
              <select
                value={selectedTopicIdForAdmin}
                onChange={(e) => setSelectedTopicIdForAdmin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold"
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Question Text</label>
              <input
                type="text"
                required
                value={quizForm.question}
                onChange={(e) => setQuizForm(prev => ({ ...prev, question: e.target.value }))}
                placeholder="e.g. What type of cultural expression is Warli Art?"
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={quizForm.option_a}
                onChange={(e) => setQuizForm(prev => ({ ...prev, option_a: e.target.value }))}
                placeholder="A. Option A"
                className="px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs"
              />
              <input
                type="text"
                required
                value={quizForm.option_b}
                onChange={(e) => setQuizForm(prev => ({ ...prev, option_b: e.target.value }))}
                placeholder="B. Option B"
                className="px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs"
              />
              <input
                type="text"
                required
                value={quizForm.option_c}
                onChange={(e) => setQuizForm(prev => ({ ...prev, option_c: e.target.value }))}
                placeholder="C. Option C"
                className="px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs"
              />
              <input
                type="text"
                required
                value={quizForm.option_d}
                onChange={(e) => setQuizForm(prev => ({ ...prev, option_d: e.target.value }))}
                placeholder="D. Option D"
                className="px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Correct Answer String</label>
              <input
                type="text"
                required
                value={quizForm.correctAnswer}
                onChange={(e) => setQuizForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                placeholder="Must match one of options above exactly"
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-colors"
            >
              Add Quiz Question →
            </button>
          </form>
        </div>
      )}

      {/* GAME MANAGER TAB (Screen 20) */}
      {adminSubTab === 'game' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-md space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
            Add Artifact Match Item
          </h3>

          <form onSubmit={handleAddGameItem} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={gameForm.artifactName}
                onChange={(e) => setGameForm(prev => ({ ...prev, artifactName: e.target.value }))}
                placeholder="Artifact Name (e.g. Paithani Saree)"
                className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs"
              />
              <input
                type="text"
                required
                value={gameForm.targetName}
                onChange={(e) => setGameForm(prev => ({ ...prev, targetName: e.target.value }))}
                placeholder="Match Target (e.g. Paithani)"
                className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md"
            >
              Save Game Item →
            </button>
          </form>
        </div>
      )}

      {/* Add Topic Modal */}
      {topicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 relative">
            <h3 className="font-cinzel text-xl font-bold text-amber-950">Add Heritage Topic</h3>
            <form onSubmit={handleAddTopic} className="space-y-3">
              <input
                type="text"
                required
                value={newTopic.name}
                onChange={(e) => setNewTopic(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Topic Name (e.g. Warli Art)"
                className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs"
              />
              <input
                type="text"
                required
                value={newTopic.state}
                onChange={(e) => setNewTopic(prev => ({ ...prev, state: e.target.value }))}
                placeholder="State / Region (e.g. Maharashtra)"
                className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs"
              />
              <textarea
                required
                rows={3}
                value={newTopic.shortDescription}
                onChange={(e) => setNewTopic(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Short Description..."
                className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold"
                >
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

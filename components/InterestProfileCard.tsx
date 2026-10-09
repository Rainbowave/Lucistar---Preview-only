import React, { useState, useRef, useEffect } from 'react';
import { User, InterestProfile } from '../types';
import { Edit2, Save, X, Plus, Trash2, Search } from 'lucide-react';
import { db } from '../services/db';

interface InterestProfileCardProps {
  user: User;
  isOwnProfile: boolean;
  onUpdate?: (profile: InterestProfile) => void;
}

export const InterestProfileCard: React.FC<InterestProfileCardProps> = ({ user, isOwnProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<InterestProfile>(user.interestProfile || {
    name: user.displayName,
    roleDynamic: 'Switch',
    rolePlayPreferences: [],
    likes: [],
    hates: [],
    relationships: []
  });

  useEffect(() => {
    setProfile(user.interestProfile || {
      name: user.displayName,
      roleDynamic: 'Switch',
      rolePlayPreferences: [],
      likes: [],
      hates: [],
      relationships: []
    });
  }, [user]);

  // Local state for inputs
  const [newRolePlay, setNewRolePlay] = useState('');
  const [newLike, setNewLike] = useState('');
  const [newHate, setNewHate] = useState('');
  const [newRelName, setNewRelName] = useState('');
  
  // Relationship tag states
  const [newRelTypes, setNewRelTypes] = useState<string[]>([]);
  const [newRelTypeInput, setNewRelTypeInput] = useState('');
  
  const [newRelRolePlays, setNewRelRolePlays] = useState<string[]>([]);
  const [newRelRolePlayInput, setNewRelRolePlayInput] = useState('');
  
  const [newRelLikes, setNewRelLikes] = useState<string[]>([]);
  const [newRelLikeInput, setNewRelLikeInput] = useState('');
  
  const [newRelHates, setNewRelHates] = useState<string[]>([]);
  const [newRelHateInput, setNewRelHateInput] = useState('');
  
  // Search state
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(profile);
    }
  };

  const addItem = (field: 'rolePlayPreferences' | 'likes' | 'hates', value: string) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
  };

  const removeItem = (field: 'rolePlayPreferences' | 'likes' | 'hates', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  // Search users when typing name
  useEffect(() => {
    const searchUsers = async () => {
      if (newRelName.trim().length > 1 && !selectedUser) {
        const users = await db.getUsers();
        const results = users.filter((u: User) => 
          u.displayName.toLowerCase().includes(newRelName.toLowerCase()) || 
          u.username.toLowerCase().includes(newRelName.toLowerCase())
        ).slice(0, 5);
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    searchUsers();
  }, [newRelName, selectedUser]);

  const selectUser = (user: User) => {
    setNewRelName(user.displayName);
    setSelectedUser(user);
    setShowResults(false);
  };

  const addTag = (
    value: string, 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    setInput: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setList(prev => [...prev, value.trim()]);
    setInput('');
  };

  const removeTag = (
    index: number, 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const addRelationship = () => {
    if (!newRelName.trim() || newRelTypes.length === 0) return;
    
    const newRel = {
      name: newRelName.trim(),
      type: newRelTypes,
      avatarUrl: selectedUser?.avatarUrl,
      userId: selectedUser?.id,
      link: selectedUser ? `/profile/${selectedUser.username}` : undefined,
      rolePlay: newRelRolePlays,
      likes: newRelLikes,
      hates: newRelHates
    };

    setProfile(prev => ({
      ...prev,
      relationships: [...(prev.relationships || []), newRel]
    }));
    
    setNewRelName('');
    setNewRelTypes([]);
    setNewRelTypeInput('');
    setNewRelRolePlays([]);
    setNewRelRolePlayInput('');
    setNewRelLikes([]);
    setNewRelLikeInput('');
    setNewRelHates([]);
    setNewRelHateInput('');
    setSelectedUser(null);
  };

  const removeRelationship = (index: number) => {
    setProfile(prev => ({
      ...prev,
      relationships: (prev.relationships || []).filter((_, i) => i !== index)
    }));
  };

  // Render a tag list
  const renderTagList = (
    title: string, 
    items: string[] | undefined, 
    field: 'rolePlayPreferences' | 'likes' | 'hates', 
    newItemValue: string, 
    setNewItemValue: (v: string) => void,
    colorClass: string
  ) => (
    <div className="mb-4">
      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2 mb-2">
        {Array.isArray(items) && items.map((item, idx) => (
          <span key={idx} className={`px-3 py-1 rounded-[5px] text-sm font-medium ${colorClass} bg-opacity-10 border border-opacity-20 flex items-center gap-1`}>
            {typeof item === 'string' ? item : String(item)}
            {isEditing && (
              <button onClick={() => removeItem(field, idx)} className="hover:text-red-500">
                <X size={12} />
              </button>
            )}
          </span>
        ))}
        {(!items || !Array.isArray(items) || items.length === 0) && !isEditing && (
          <span className="text-sm text-gray-600 font-normal">None listed</span>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem(field, newItemValue);
                setNewItemValue('');
              }
            }}
            placeholder={`Add ${title}...`}
            className="flex-1 bg-dark-900 border border-white/10 rounded-[5px] px-3 py-1 text-sm text-white focus:outline-none focus:border-brand-500"
          />
          <button 
            onClick={() => {
              addItem(field, newItemValue);
              setNewItemValue('');
            }}
            className="p-1 bg-brand-600 rounded-[5px] text-white hover:bg-brand-500"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const renderMiniTagInput = (
    label: string,
    tags: string[],
    inputValue: string,
    setInputValue: (v: string) => void,
    setTags: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string
  ) => (
    <div>
      <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">{label}</label>
      <div className="flex flex-wrap gap-1 mb-1">
        {tags.map((tag, idx) => (
          <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white rounded-[5px] flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(idx, setTags)} className="hover:text-red-400"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input 
          placeholder={placeholder} 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(inputValue, setTags, setInputValue);
            }
          }}
          className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-500"
        />
        <button 
          onClick={() => addTag(inputValue, setTags, setInputValue)}
          className="p-1 bg-white/10 rounded-[5px] hover:bg-white/20 text-white"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
      <div 
        className="bg-dark-850 border border-[#fc8347]/30 rounded-[5px] p-6 shadow-xl relative group transition-all duration-300 min-h-[300px] h-full"
      >
        {/* Resizer Handles */}
        <div className="absolute inset-0 pointer-events-none z-50">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-brand-500 rounded-full block"></span>
          Interest Profile
        </h3>
        {isOwnProfile && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            {isEditing ? <Save size={18} className="text-green-500" /> : <Edit2 size={18} />}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Name & Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Name / Persona</label>
            {isEditing ? (
              <input 
                type="text" 
                value={profile.name || ''} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              />
            ) : (
              <p className="text-white font-medium text-lg">{profile.name || user.displayName}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Role / Dynamic</label>
            {isEditing ? (
              <input 
                type="text" 
                value={profile.roleDynamic || ''} 
                onChange={(e) => setProfile({...profile, roleDynamic: e.target.value})}
                className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="e.g. Switch, Top, etc."
              />
            ) : (
              <p className="text-brand-400 font-medium text-lg">{profile.roleDynamic || 'Not specified'}</p>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 my-4"></div>

        {/* Role Play Preferences */}
        {renderTagList(
          "Role Play Preferences", 
          profile.rolePlayPreferences, 
          "rolePlayPreferences", 
          newRolePlay, 
          setNewRolePlay, 
          "text-purple-400 border-purple-500/30 bg-purple-500"
        )}

        {/* Likes */}
        {renderTagList(
          "Likes", 
          profile.likes, 
          "likes", 
          newLike, 
          setNewLike, 
          "text-green-400 border-green-500/30 bg-green-500"
        )}

        {/* Hates */}
        {renderTagList(
          "Hates / Limits", 
          profile.hates, 
          "hates", 
          newHate, 
          setNewHate, 
          "text-red-400 border-red-500/30 bg-red-500"
        )}

        <div className="border-t border-white/5 my-4"></div>

        {/* Relationships */}
        <div className="mb-4">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Relationships</h4>
          <div className="space-y-3">
            {Array.isArray(profile.relationships) && profile.relationships.map((rel, idx) => (
              <div key={idx} className="bg-dark-900/50 p-3 rounded-[5px] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[5px] bg-brand-900 flex items-center justify-center text-xs font-bold text-brand-200 overflow-hidden border border-white/10">
                      {rel.avatarUrl ? (
                        <img src={rel.avatarUrl} alt={rel.name} className="w-full h-full object-cover" />
                      ) : (
                        (rel.name || '?').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span className="block text-white font-bold text-sm">{rel.name || 'Unknown'}</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {Array.isArray(rel.type) ? rel.type.map((t, i) => (
                          <span key={i} className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 px-1 rounded-[5px]">{t}</span>
                        )) : (
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{rel.type || 'Unknown'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <button onClick={() => removeRelationship(idx)} className="text-red-500 hover:text-red-400 p-1 hover:bg-white/5 rounded-[5px]">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                
                {/* Relationship Details */}
                {(rel.rolePlay?.length || rel.likes?.length || rel.hates?.length) ? (
                  <div className="mt-2 space-y-1 pl-11">
                    {rel.rolePlay && rel.rolePlay.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">RP:</span>
                        {rel.rolePlay.map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded-[5px] border border-purple-500/20">{tag}</span>
                        ))}
                      </div>
                    )}
                    {rel.likes && rel.likes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Likes:</span>
                        {rel.likes.map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-[5px] border border-green-500/20">{tag}</span>
                        ))}
                      </div>
                    )}
                    {rel.hates && rel.hates.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Hates:</span>
                        {rel.hates.map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-[5px] border border-red-500/20">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
            {(!profile.relationships || !Array.isArray(profile.relationships) || profile.relationships.length === 0) && !isEditing && (
              <span className="text-sm text-gray-600 font-normal">No relationships listed</span>
            )}
          </div>
          
          {isEditing && (
             <div className="flex flex-col gap-3 mt-3 bg-dark-900/30 p-3 rounded-[5px] border border-white/5">
               <div className="flex gap-2 items-start relative">
                 <div className="flex-1 relative">
                   <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Name</label>
                   <div className="relative">
                     <input 
                       placeholder="Name" 
                       value={newRelName} 
                       onChange={e => {
                         setNewRelName(e.target.value);
                         if (selectedUser && e.target.value !== selectedUser.displayName) {
                           setSelectedUser(null);
                         }
                       }}
                       className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                     />
                     {isEditing && showResults && searchResults.length > 0 && (
                       <div className="absolute top-full left-0 w-full bg-dark-800 border border-white/10 rounded-[5px] shadow-xl z-50 mt-1 max-h-48 overflow-y-auto">
                         {searchResults.map(u => (
                           <div 
                             key={u.id}
                             onClick={() => {
                               setNewRelName(u.displayName);
                               setSelectedUser(u);
                               setShowResults(false);
                               setSearchResults([]);
                             }}
                             className="flex items-center gap-2 p-2 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                           >
                             <img src={u.avatarUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                             <div>
                               <p className="text-xs font-bold text-white">{u.displayName}</p>
                               <p className="text-[10px] text-gray-500">@{u.username}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
                 <div className="flex-1">
                   {renderMiniTagInput(
                     "Role / Type",
                     newRelTypes,
                     newRelTypeInput,
                     setNewRelTypeInput,
                     setNewRelTypes,
                     "e.g. Partner"
                   )}
                 </div>
               </div>
               
               <div className="grid grid-cols-3 gap-2">
                  {renderMiniTagInput(
                    "Role Play",
                    newRelRolePlays,
                    newRelRolePlayInput,
                    setNewRelRolePlayInput,
                    setNewRelRolePlays,
                    "e.g. Petplay"
                  )}
                  {renderMiniTagInput(
                    "Likes",
                    newRelLikes,
                    newRelLikeInput,
                    setNewRelLikeInput,
                    setNewRelLikes,
                    "e.g. Cuddles"
                  )}
                  {renderMiniTagInput(
                    "Hates",
                    newRelHates,
                    newRelHateInput,
                    setNewRelHateInput,
                    setNewRelHates,
                    "e.g. Spiders"
                  )}
               </div>
               
               <button 
                 onClick={addRelationship} 
                 className="w-full py-2 bg-brand-600 rounded-[5px] text-white hover:bg-brand-500 flex items-center justify-center gap-2 text-sm font-bold mt-1"
               >
                 <Plus size={16} /> Add Relationship
               </button>
             </div>
          )}
        </div>
        </div>
      </div>
  );
};

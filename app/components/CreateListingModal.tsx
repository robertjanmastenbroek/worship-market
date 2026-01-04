"use client";
import React, { useState } from 'react';
import { Music, Mic2, FileText, Upload, ShieldCheck } from 'lucide-react';
import Modal from '../Modal';

// --- NEW LISTING MODAL ---
export const CreateListingModal = ({ isOpen, onClose, onPublish }: any) => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState('asset'); // asset, service, knowledge
    const [formData, setFormData] = useState({ title: '', price: '', category: 'Worship Pads', description: '', deliveryTime: '24 Hours' });
    const [theologyCheck, setTheologyCheck] = useState({
      orthodox: false,
      original: false,
      noAiSermon: false
    });
  
    const isTheologyPassed = theologyCheck.orthodox && theologyCheck.original && (type !== 'knowledge' || theologyCheck.noAiSermon);
  
    const handlePublish = () => {
      // Create new product object
      const newProduct = {
        id: Date.now(),
        type,
        category: formData.category,
        title: formData.title || 'Untitled Listing',
        price: parseFloat(formData.price) || 0,
        author: 'Robert-Jan (You)',
        authorVerified: true,
        rating: 0,
        reviews: 0,
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop', // Placeholder
        description: formData.description,
        deliveryTime: type === 'service' ? formData.deliveryTime : null,
        fileSize: type === 'asset' ? '25 MB' : null
      };
      
      onPublish(newProduct);
      onClose();
      setStep(1);
      setFormData({ title: '', price: '', category: 'Worship Pads', description: '', deliveryTime: '24 Hours' });
    };
  
    if (!isOpen) return null;
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Listing">
        <div className="space-y-6">
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm font-medium mb-6">
            <span className={`px-2 py-1 rounded ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1. Type</span>
            <div className="h-px w-4 bg-slate-700"></div>
            <span className={`px-2 py-1 rounded ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2. Details</span>
            <div className="h-px w-4 bg-slate-700"></div>
            <span className={`px-2 py-1 rounded ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3. Safety</span>
          </div>
  
          {/* STEP 1: SELECT TYPE */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'asset', label: 'Digital Asset', icon: Music, desc: 'Pads, Loops, Templates' },
                { id: 'service', label: 'Service', icon: Mic2, desc: 'Mixing, Editing, Vocals' },
                { id: 'knowledge', label: 'Knowledge', icon: FileText, desc: 'Prompts, Guides' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setType(item.id)}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all ${
                    type === item.id 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={24} className={type === item.id ? 'text-indigo-400' : 'text-slate-500'} />
                  <div>
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs opacity-60 mt-1">{item.desc}</div>
                  </div>
                </button>
              ))}
              <div className="col-span-full flex justify-end mt-4">
                 <button 
                   onClick={() => setStep(2)}
                   className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-slate-200"
                 >
                   Next Step
                 </button>
              </div>
            </div>
          )}
  
          {/* STEP 2: DETAILS FORM */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Title</label>
                 <input 
                   type="text" 
                   value={formData.title} 
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Ambient Pads Vol. 1" 
                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none" 
                 />
               </div>
  
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Price ($)</label>
                   <input 
                     type="number" 
                     value={formData.price}
                     onChange={e => setFormData({...formData, price: e.target.value})}
                     placeholder="29.00" 
                     className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Category</label>
                   <select 
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                     className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                   >
                     <option>Worship Pads</option>
                     <option>Backing Tracks</option>
                     <option>Templates</option>
                     <option>Mixing</option>
                     <option>Video Editing</option>
                   </select>
                 </div>
               </div>
  
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Description</label>
                 <textarea 
                   rows={3} 
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Describe your product..." 
                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                 ></textarea>
               </div>
  
               <div className="p-4 bg-slate-900/50 border border-dashed border-white/20 rounded-xl">
                 {type === 'asset' || type === 'knowledge' ? (
                   <div className="text-center py-4 cursor-pointer hover:bg-white/5 transition-colors rounded-lg">
                      <Upload className="mx-auto text-slate-500 mb-2" />
                      <div className="text-sm font-medium text-white">Upload File</div>
                      <div className="text-xs text-slate-500">ZIP, MP3, PDF (Max 5GB)</div>
                   </div>
                 ) : (
                   <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Delivery Time</label>
                      <select 
                        value={formData.deliveryTime}
                        onChange={e => setFormData({...formData, deliveryTime: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white"
                      >
                        <option>24 Hours</option>
                        <option>3 Days</option>
                        <option>7 Days</option>
                      </select>
                   </div>
                 )}
               </div>
  
               <div className="flex justify-between mt-4">
                 <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white text-sm">Back</button>
                 <button 
                   onClick={() => setStep(3)}
                   className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-slate-200"
                 >
                   Review & Safety
                 </button>
              </div>
            </div>
          )}
  
          {/* STEP 3: THEOLOGICAL SAFETY CHECK */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl flex gap-3">
                 <ShieldCheck className="text-indigo-400 shrink-0" />
                 <div>
                    <h4 className="font-bold text-indigo-300 text-sm">Theological Safety Check</h4>
                    <p className="text-xs text-indigo-100/70 mt-1">
                      You are responsible for the spiritual integrity of what you sell. 
                      Violations will result in an immediate ban.
                    </p>
                 </div>
              </div>
  
              <div className="space-y-3">
                 <label className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-900 border border-transparent hover:border-white/10">
                   <input 
                     type="checkbox" 
                     checked={theologyCheck.orthodox}
                     onChange={(e) => setTheologyCheck({...theologyCheck, orthodox: e.target.checked})}
                     className="mt-1 accent-emerald-500" 
                   />
                   <div className="text-sm text-slate-300">
                     <span className="text-white font-bold block mb-0.5">Orthodox Alignment</span>
                     I certify this content does not promote heresy or violate the core tenets of the Nicene Creed.
                   </div>
                 </label>
  
                 <label className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-900 border border-transparent hover:border-white/10">
                   <input 
                     type="checkbox" 
                     checked={theologyCheck.original}
                     onChange={(e) => setTheologyCheck({...theologyCheck, original: e.target.checked})}
                     className="mt-1 accent-emerald-500" 
                   />
                   <div className="text-sm text-slate-300">
                     <span className="text-white font-bold block mb-0.5">Strictly Original</span>
                     I certify I own 100% of the copyright. This is NOT a cover song requiring mechanical licensing.
                   </div>
                 </label>
  
                 {type === 'knowledge' && (
                   <label className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-900 border border-transparent hover:border-white/10">
                     <input 
                       type="checkbox" 
                       checked={theologyCheck.noAiSermon}
                       onChange={(e) => setTheologyCheck({...theologyCheck, noAiSermon: e.target.checked})}
                       className="mt-1 accent-emerald-500" 
                     />
                     <div className="text-sm text-slate-300">
                       <span className="text-white font-bold block mb-0.5">AI Ethics</span>
                       If this contains AI content, I have human-verified it for glitches and weirdness. I am not selling "AI-Written Sermons."
                     </div>
                   </label>
                 )}
              </div>
  
              <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                 <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white text-sm">Back</button>
                 <button 
                   disabled={!isTheologyPassed}
                   onClick={handlePublish}
                   className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                     isTheologyPassed 
                     ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                     : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                   }`}
                 >
                   <Upload size={18} /> Publish Listing
                 </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };
  
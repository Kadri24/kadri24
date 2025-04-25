let openWindows = {}; // Tracks open windows: { windowId: { windowElement: element, dockIconElement: element, isMinimized: false } }
let dockElement = null; // Initialize later in DOMContentLoaded
let dockDivider = null; // Initialize later in DOMContentLoaded
let activeWindow = null; // Track active window globally
let topBarElement = null; // Initialize later in DOMContentLoaded

// --- App Color Definitions ---
const appBackgrounds = {
    // Single Colors
    'setup': '#8e8e93', // Settings Grey
    'discord': '#5865F2', // Discord Blue/Purple
    'twitch': '#9146FF', // Twitch Purple
    'snapchat': '#FFFC00', // Snapchat Yellow (Icon text should be dark)
    'twitter': '#1DA1F2', // Twitter Blue
    'facebook': '#1877F2', // Facebook Blue
    'youtube': '#FF0000', // YouTube Red (Could use white background with red icon?)
    // Gradients
    'instagram': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    'tiktok': 'linear-gradient(45deg, #000000 0%, #EE1D52 50%, #69C9D0 100%)',
    // Add other apps as needed
};

// Helper function to get background style
function getAppBackgroundStyle(appName) {
    const key = appName ? appName.toLowerCase() : '';
    return appBackgrounds[key] || '#555'; // Fallback to default grey
}

// --- Launchpad Data (Customize as needed) ---
const launchpadApps = [
    { id: 'setup-window', name: 'Setup', iconClass: 'fas fa-cogs' },
    // Socials - Assuming these trigger dynamic window creation
    { id: 'window-instagram', name: 'Instagram', iconClass: 'fab fa-instagram', url: 'https://www.instagram.com/_kadri24_' },
    { id: 'window-tiktok', name: 'TikTok', iconClass: 'fab fa-tiktok', url: 'https://www.tiktok.com/@_kadri24_'}, 
    { id: 'window-discord', name: 'Discord', iconClass: 'fab fa-discord', url: 'https://discord.com/invite/kadri24' },
    { id: 'window-twitch', name: 'Twitch', iconClass: 'fab fa-twitch', url: 'https://www.twitch.tv/kadri24' },
    { id: 'window-youtube', name: 'YouTube', iconClass: 'fab fa-youtube', url: 'https://www.youtube.com/@kadri24' },
    { id: 'window-snapchat', name: 'Snapchat', iconClass: 'fab fa-snapchat', url: 'https://www.snapchat.com/add/kadri.24' },
    { id: 'window-twitter', name: 'Twitter', iconClass: 'fab fa-twitter', url: 'https://www.x.com/_kadri24_' },
    { id: 'window-facebook', name: 'Facebook', iconClass: 'fab fa-facebook', url: 'https://www.facebook.com/zkadri24z/' },
    // Add other apps here if they exist
    // { id: 'some-other-app', name: 'Other App', iconClass: 'fas fa-star' },
];

// --- Consolidated bringToFront ---
function bringToFront(windowElement) {
     if (!windowElement) return;
     // Reset z-index for all windows
     document.querySelectorAll('.window').forEach(w => {
         w.style.zIndex = 100;
     });
     // Set active window z-index
     windowElement.style.zIndex = 101;
     activeWindow = windowElement;

     // Clear minimized state when bringing to front
     if (windowElement.id && openWindows[windowElement.id]) {
         openWindows[windowElement.id].isMinimized = false;
     }
     console.log(`${windowElement.id} brought to front.`);
     // Show or hide dock based on fullscreen state
     if (dockElement) {
         if (windowElement.classList.contains('fullscreen')) {
             dockElement.style.transform = 'translateY(100px)';
         } else {
             dockElement.style.transform = 'translateY(0)';
         }
     }
}

// Function to create/update a dock icon using Font Awesome
function manageDockIcon(windowId, appName, iconClassString, isStatic) {
    if (!dockElement) {
        console.error("Dock element not found during manageDockIcon!");
        return;
    }

    // MODIFIED CHECK: Create icon if tracking doesn't exist OR if it exists but has no dock icon yet
    if (!openWindows[windowId] || (openWindows[windowId] && !openWindows[windowId].dockIconElement)) {
        
        // If tracking exists but icon doesn't, use the existing tracking entry
        let isNewTracking = !openWindows[windowId];
        if (!isNewTracking) {
             console.log(`manageDockIcon: Tracking for ${windowId} exists, but no icon. Creating icon now.`);
        }

        const newIcon = document.createElement('div');
        newIcon.className = 'dock-icon';
        newIcon.setAttribute('data-app-id', windowId);
        newIcon.innerHTML = ''; // Clear previous content

        // --- Create Inner Container for Icon --- 
        const iconContainer = document.createElement('div');
        iconContainer.style.width = '100%';
        iconContainer.style.height = '100%';
        iconContainer.style.borderRadius = 'inherit'; 
        iconContainer.style.display = 'flex';
        iconContainer.style.justifyContent = 'center';
        iconContainer.style.alignItems = 'center';
        // Set background using helper function
        iconContainer.style.background = getAppBackgroundStyle(appName);

        // --- Create <i> tag directly from iconClassString --- 
        let iconColor = 'white'; 
        const appKey = appName ? appName.toLowerCase() : '';
        if (appKey === 'snapchat') {
            iconColor = '#333';
        } else if (appKey === 'youtube') {
             iconColor = '#FF0000'; // Special case for YouTube icon color
        }

        const iconElement = document.createElement('i');
        // Use the provided class string, or a default fallback
        iconElement.className = iconClassString || 'fas fa-window-maximize'; 
        iconElement.style.fontSize = '26px'; // Apply base size
        iconElement.style.color = iconColor; // Apply determined color
        
        // Special size adjustments if needed (e.g., for YouTube)
        if (appKey === 'youtube') {
             iconElement.style.fontSize = '28px'; 
        }

        iconContainer.innerHTML = ''; // Clear container first
        iconContainer.appendChild(iconElement); // Add the created <i> element
        // --- End Direct <i> Tag Creation ---
        
        newIcon.appendChild(iconContainer); // Add styled container to dock icon

        const tooltip = document.createElement('div');
        tooltip.className = 'dock-tooltip';
        tooltip.textContent = appName || windowId;
        // Append tooltip *after* setting innerHTML for the icon
        newIcon.appendChild(tooltip);

        // Add click listener
        newIcon.addEventListener('click', () => {
            handleDockIconClick(windowId);
        });

        // Insert into dock
        if (dockDivider) {
            dockElement.insertBefore(newIcon, dockDivider);
        } else {
            dockElement.appendChild(newIcon);
        }

        // Trigger the animation by adding the .added class after insertion
        requestAnimationFrame(() => {
             requestAnimationFrame(() => { // Double rAF for better cross-browser consistency
                newIcon.classList.add('added');
            });
        });

        // Register window OR just the static icon
        if (isNewTracking) {
            // Create new tracking entry
            if (!isStatic) {
                openWindows[windowId] = { windowElement: null, dockIconElement: newIcon, isMinimized: false };
                newIcon.classList.add('running'); // Add running state for window icons
                console.log(`Dock icon created for window ${windowId}.`);
            } else {
                openWindows[windowId] = { windowElement: null, dockIconElement: newIcon, isMinimized: false };
                console.log(`Dock icon created for static ${windowId}.`);
            }
        } else {
            // Update existing tracking entry with the new icon element
            openWindows[windowId].dockIconElement = newIcon;
            if (!isStatic) {
                 newIcon.classList.add('running'); // Ensure running state is added
            }
             console.log(`Dock icon element updated for existing tracking ${windowId}.`);
        }

    } else {
         // Icon already exists and is linked in tracking
         console.log(`manageDockIcon: Icon for ${windowId} already exists and is tracked.`);
         // Optionally, ensure it's marked as running if it corresponds to an active window
         if (!isStatic && openWindows[windowId] && openWindows[windowId].windowElement && openWindows[windowId].windowElement.style.display !== 'none') {
             if (openWindows[windowId].dockIconElement) {
                  openWindows[windowId].dockIconElement.classList.add('running');
             }
         }
    }
}

// Function to remove a dock icon
function removeDockIcon(windowId) {
    console.log(` -> removeDockIcon called for ${windowId}`);
    const windowData = openWindows[windowId];

    if (windowData && windowData.dockIconElement) {
        const iconElement = windowData.dockIconElement;
        console.log(` -> Found icon element for ${windowId}. Starting closing animation...`);

        // 1. Add the closing animation class
        iconElement.classList.add('dock-icon-closing');
        iconElement.classList.remove('added'); // Remove added class if present

        // 2. Set a timeout to remove the element after the animation (duration matches CSS transition)
        const animationDuration = 300; // Should match the opacity/width transition duration in CSS (0.3s)
        setTimeout(() => {
            console.log(` -> Animation finished for ${windowId}. Removing element and tracking.`);
            iconElement.remove();
            delete openWindows[windowId];
            console.log(` -> Successfully removed icon and tracking for ${windowId}`);
        }, animationDuration);

    } else {
        console.warn(` -> Failed to start closing animation for ${windowId}. Tracking data or element not found:`, windowData);
        // Clean up tracking data if element is missing but data exists
        if (openWindows[windowId]) {
            delete openWindows[windowId];
            console.log(` -> Cleaned up tracking data for ${windowId} as element was missing.`);
        }
    }
}

// --- Helper function to get dock icon position ---
function getIconPosition(windowId) {
    const windowData = openWindows[windowId];
    if (windowData && windowData.dockIconElement) {
        return windowData.dockIconElement.getBoundingClientRect();
    }
    // Fallback: Try to find the dock icon by data-attribute if not linked yet
    const dockIcon = dockElement.querySelector(`.dock-icon[data-app-id="${windowId}"]`);
    if (dockIcon) {
        return dockIcon.getBoundingClientRect();
    }
    console.warn(`Could not find dock icon for windowId: ${windowId}`);
    return null; // Return null if not found
}

// --- Store last known position before minimizing ---
function storeLastPosition(windowElement) {
    if (!windowElement || !windowElement.id || !openWindows[windowElement.id]) return;
    const windowId = windowElement.id;
    const rect = windowElement.getBoundingClientRect();
    openWindows[windowId].lastPosition = {
        top: windowElement.offsetTop,
        left: windowElement.offsetLeft,
        width: rect.width,
        height: rect.height
    };
    // ADDED LOGGING
    console.log(`[storeLastPosition] Stored for ${windowId}:`, JSON.stringify(openWindows[windowId].lastPosition)); 
}

// --- Restore last known position ---
function restoreLastPosition(windowElement) {
    if (!windowElement || !windowElement.id) return; // Simplified check
    
    const windowId = windowElement.id;
    const windowData = openWindows[windowId];
    // Define defaults within the function scope
    const windowDefaultsLocal = window.windowDefaults || {}; // Access global or use empty object
    const defaults = windowDefaultsLocal[windowId] || { width: '600px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    if (!windowData || !windowData.lastPosition) {
        // ADDED LOGGING
        console.log(`[restoreLastPosition] No last position for ${windowId}, using defaults.`);
        // Fallback to default center if no position stored
        windowElement.style.width = defaults.width;
        windowElement.style.height = defaults.height;
        windowElement.style.top = defaults.top;
        windowElement.style.left = defaults.left;
        windowElement.style.transform = defaults.transform;
        return;
    }
    
    const lastPos = windowData.lastPosition;
    // ADDED LOGGING
    console.log(`[restoreLastPosition] Restoring for ${windowId}:`, JSON.stringify(lastPos));
    
    windowElement.style.width = `${lastPos.width}px`;
    windowElement.style.height = `${lastPos.height}px`;
    windowElement.style.top = `${lastPos.top}px`;
    windowElement.style.left = `${lastPos.left}px`;
    windowElement.style.transform = 'none'; // Crucial: Remove translate for stored positions
    
    // ADDED LOGGING
    console.log(`[restoreLastPosition] Applied styles for ${windowId}: w=${windowElement.style.width}, h=${windowElement.style.height}, t=${windowElement.style.top}, l=${windowElement.style.left}`);
}

// Modified Dock Icon Click Handler
function handleDockIconClick(windowId) {
    const windowData = openWindows[windowId];
    let windowElement = windowData ? windowData.windowElement : null;

    // If tracking exists but element isn't linked, try finding it by ID
    if (windowData && !windowElement) {
        console.log(`handleDockIconClick: Window element for ${windowId} not linked, attempting getElementById.`);
        windowElement = document.getElementById(windowId);
        if (windowElement) {
            console.log(` -> Found element via ID, linking now.`);
            windowData.windowElement = windowElement; // Link it now
        } else {
            console.error(` -> Could not find element ${windowId} by ID either. Aborting click handler.`);
             return;
        }
    }

    // Proceed if we have the window element linked now
    if (windowElement) {
        const windowId = windowElement.id;
        const windowData = openWindows[windowId];
        const isHidden = window.getComputedStyle(windowElement).display === 'none';

        if (windowData && (windowData.isMinimized || isHidden)) {
            console.log(`handleDockIconClick: Window ${windowId} is minimized. Restoring...`);

            const iconRect = getIconPosition(windowId);
            if (!iconRect) {
                console.error("Cannot restore: Dock icon position not found. Showing directly.");
                restoreLastPosition(windowElement); // Restore position/size
                windowElement.style.opacity = 1;
                windowElement.style.display = 'block';
                if(windowData) windowData.isMinimized = false;
                bringToFront(windowElement);
                return;
            }

            // --- Restore Animation --- 
            // 1. Prepare the final state (invisible, but positioned/sized)
            windowElement.style.transition = 'none'; // IMPORTANT: Disable transitions for setup
            windowElement.classList.remove('minimizing');
            restoreLastPosition(windowElement); // Set final size/position
            windowElement.style.display = 'block'; // Make it part of layout
            windowElement.style.opacity = '0'; // Start transparent

            // 2. Calculate initial transform based on dock icon
            // Get the actual final dimensions AFTER restoring size/pos and making display:block
            const targetRect = windowElement.getBoundingClientRect(); 
            if (targetRect.width === 0 || targetRect.height === 0) { 
                console.error("Target rect has zero dimensions. Cannot calculate restore animation.");
                // Fallback: show directly
                windowElement.style.opacity = 1;
                windowElement.style.transform = 'none';
                if(windowData) windowData.isMinimized = false;
                bringToFront(windowElement);
                return;
            }
            
            const scaleX = Math.max(0.01, iconRect.width / targetRect.width); // Prevent zero scale
            const scaleY = Math.max(0.01, iconRect.height / targetRect.height);
            // Calculate translation needed to move the window's *restored* top-left corner
            // to the icon's top-left corner, then adjust for centering the scaled window within the icon space.
            const translateX = iconRect.left - targetRect.left;
            const translateY = iconRect.top - targetRect.top;

            // Set transform origin towards the icon's center relative to the window's final top-left
            const originXPercent = ((iconRect.left + iconRect.width / 2) - targetRect.left) / targetRect.width * 100;
            const originYPercent = ((iconRect.top + iconRect.height / 2) - targetRect.top) / targetRect.height * 100;
            windowElement.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;

            // 3. Apply the initial state (at the dock icon, scaled down, transparent)
            windowElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

            // 4. Force reflow - VERY important
            windowElement.offsetHeight; 

            // 5. Re-enable transitions and animate back to normal state
            windowElement.style.transition = ''; // Use CSS defined transitions
            requestAnimationFrame(() => {
                windowElement.style.transform = 'translate(0, 0) scale(1)'; 
                windowElement.style.opacity = '1';
            });
            
            // 6. Clean up origin after animation (optional but good practice)
            // Use a timeout matching the transition duration
            const animationDuration = 350; // Match CSS
            setTimeout(() => {
                 windowElement.style.transformOrigin = '50% 100%'; // Reset to default
            }, animationDuration);

            // Restore previous fullscreen state AFTER animation setup
            if (windowData.wasFullscreen) {
                 // Apply fullscreen styles directly without transition for instant effect
                 windowElement.classList.add('fullscreen');
                 windowElement.querySelectorAll('.resize-handle').forEach(handle => handle.style.display = 'none');
                 if (dockElement) dockElement.style.transform = 'translateY(100px)';
                 // Override position/size for fullscreen
                 windowElement.style.top = '24px'; 
                 windowElement.style.left = '0';
                 windowElement.style.width = '100%';
                 windowElement.style.height = 'calc(100% - 24px)';
                 windowElement.style.transform = 'none'; // Ensure no leftover transform
            }

            windowData.isMinimized = false;
            bringToFront(windowElement);

            // Bounce the icon
            if (windowData.dockIconElement) {
                windowData.dockIconElement.classList.add('bounce');
                setTimeout(() => {
                    if (windowData.dockIconElement) windowData.dockIconElement.classList.remove('bounce');
                }, 500);
            }

        } else {
             // Window is visible: Bring to front OR minimize if it's the active window
             if (activeWindow === windowElement) {
                 console.log(`handleDockIconClick: Active window ${windowId} clicked. Minimizing...`);
                 const minimizeButton = windowElement.querySelector('.control.minimize');
                 if (minimizeButton) minimizeButton.click();
             } else {
                 console.log(`handleDockIconClick: Inactive window ${windowId} clicked. Bringing to front...`);
                 bringToFront(windowElement);
                 if (windowData && windowData.dockIconElement) {
                    windowData.dockIconElement.classList.add('bounce');
                    setTimeout(() => {
                        if (windowData.dockIconElement) windowData.dockIconElement.classList.remove('bounce');
                    }, 500);
                 }
             }
        }
    } else {
        console.warn(`Window element could not be found or linked for windowId during dock click.`);
    }
}

// --- NEW Unified openWindow Function ---
function openWindow(windowId, appName, iconClassString, url = null) {
    console.log(`[openWindow START] ID=${windowId}, Name=${appName}, HasURL=${!!url}, IconClass=${iconClassString}`); // Log IconClass
    const existingWindow = document.getElementById(windowId);
    console.log(` -> [openWindow] Found existing element by ID?`, existingWindow ? 'YES' : 'NO', existingWindow);
    let windowData = openWindows[windowId]; 
    console.log(` -> [openWindow] Found tracking data?`, windowData ? 'YES' : 'NO', windowData);

    // Ensure basic tracking exists if the window DOM element is found
    if (existingWindow && !windowData) {
        console.log(` -> [openWindow] Window element exists but not tracked. Registering basic tracking.`);
        openWindows[windowId] = { windowElement: existingWindow, dockIconElement: null, isMinimized: false };
        windowData = openWindows[windowId]; 
    }
    
    // Case 1: Window is already open and visible (and tracked)
    if (windowData && windowData.windowElement && !windowData.isMinimized && windowData.windowElement.style.display !== 'none') {
        console.log(` -> [openWindow] Entering Case 1: Already open.`);
        bringToFront(windowData.windowElement);
        if (windowData.dockIconElement) {
            windowData.dockIconElement.classList.add('bounce');
            setTimeout(() => windowData.dockIconElement?.classList.remove('bounce'), 500);
        }
    // Case 2: Window exists and is minimized (tracked)
    } else if (windowData && windowData.isMinimized) {
        console.log(` -> [openWindow] Entering Case 2: Minimized.`);
        handleDockIconClick(windowId); 
    // Case 3: Window exists in DOM but is hidden (or newly tracked)
    } else if (existingWindow) { 
        console.log(` -> [openWindow] Entering Case 3: Exists, hidden/newly tracked.`);
        windowData = openWindows[windowId]; 
        if (!windowData) { 
            console.error(` -> [openWindow] ERROR: Tracking data missing for existing window ${windowId}!`);
            return;
        }
        // Ensure dock icon exists
        if (!windowData.dockIconElement) {
            console.log(` -> [openWindow] Creating Dock Icon for ${windowId}`);
            let finalIconClass = iconClassString; // Use passed class string
            // Determine appropriate fallback icon class if needed
            if (!finalIconClass) {
                 if (windowId === 'setup-window') finalIconClass = 'fas fa-cogs';
                 else if (windowId === 'window-contact') finalIconClass = 'fas fa-envelope';
                 else finalIconClass = 'fas fa-window-maximize'; // Generic fallback class
            }
            // Call manageDockIcon with the class string
            manageDockIcon(windowId, appName, finalIconClass, false); 
            
            const newIcon = dockElement.querySelector(`.dock-icon[data-app-id="${windowId}"]`);
            if (newIcon) {
                 windowData.dockIconElement = newIcon;
                 console.log(` -> [openWindow] Successfully created and linked dock icon for ${windowId}`);
                 newIcon.classList.add('running'); 
            } else {
                 console.error(` -> [openWindow] Failed to find newly created dock icon for ${windowId}`);
            }
        } else {
             windowData.dockIconElement.classList.add('running');
        }

        // Restore position/size, show, and bring to front
        console.log(` -> [openWindow] Calling restoreLastPosition for ${windowId}`);
        restoreLastPosition(existingWindow);
        console.log(` -> [openWindow] Setting display=block for ${windowId}`);
        existingWindow.style.display = 'block';
        existingWindow.style.opacity = '1'; 
        windowData.isMinimized = false; 
        console.log(` -> [openWindow] Calling bringToFront for ${windowId}`);
        bringToFront(existingWindow);
        if (windowData.dockIconElement) { 
           console.log(` -> [openWindow] Bouncing dock icon for ${windowId}`);
           windowData.dockIconElement.classList.add('bounce');
           setTimeout(() => windowData.dockIconElement?.classList.remove('bounce'), 500);
       }
    // Case 4: Window needs dynamic creation (URL provided)
    } else if (url) {
        console.log(` -> [openWindow] Entering Case 4: Needs dynamic creation.`);
        if (typeof createSocialWindow === 'function') {
             // Pass the determined icon class string down
            createSocialWindow(appName, url, iconClassString); 
        } else {
            console.error('createSocialWindow function is not defined!');
        }
    // Case 5: Window ID specified but doesn't exist in DOM and no URL given
    } else {
        console.log(` -> [openWindow] Entering Case 5: ERROR - Window ID ${windowId} not found and no URL.`);
        console.error(` -> [openWindow] Case 5: ERROR - Window ID ${windowId} not found in DOM and no URL provided.`);
    }
    console.log(`[openWindow END] ID=${windowId}`); 
}

// --- NEW closeWindow Function ---
function closeWindow(windowId) {
    const windowData = openWindows[windowId];
    if (!windowData || !windowData.windowElement) {
        console.warn(`Cannot close window ${windowId}: Not found or not tracked.`);
        const element = document.getElementById(windowId);
        if (element) element.remove();
        if (openWindows[windowId]) delete openWindows[windowId];
        removeDockIcon(windowId);
        return;
    }

    const windowElement = windowData.windowElement;
    const wasFullscreen = windowElement.classList.contains('fullscreen');
    const isDynamic = windowElement.classList.contains('dynamic-window');

    if (isDynamic) {
        console.log(` -> Closing dynamic window ${windowId}. Removing element.`);
         const iframe = windowElement.querySelector('iframe.social-iframe');
         if (iframe) iframe.src = 'about:blank';
         windowElement.remove();
    } else {
        console.log(` -> Closing static window ${windowId}. Hiding element.`);
        windowElement.style.display = 'none';
        const defaults = window.windowDefaults ? window.windowDefaults[windowId] : null;
        if (defaults) {
            windowElement.style.width = defaults.width;
            windowElement.style.height = defaults.height;
            windowElement.style.top = defaults.top;
            windowElement.style.left = defaults.left;
            windowElement.style.transform = defaults.transform;
        } else {
             windowElement.style.width = '600px';
             windowElement.style.height = '400px';
             windowElement.style.top = '50%';
             windowElement.style.left = '50%';
             windowElement.style.transform = 'translate(-50%, -50%)';
        }
        windowElement.classList.remove('fullscreen');
    }

    removeDockIcon(windowId); // This also deletes openWindows[windowId] tracking

    if (wasFullscreen) {
        adjustDockAndTopBarVisibility(); // Check if dock/bar should be shown
    }
}

// --- NEW minimizeWindow Function ---
function minimizeWindow(windowId) {
    const windowData = openWindows[windowId];
    if (!windowData || !windowData.windowElement || windowData.isMinimized) {
        console.warn(`Cannot minimize window ${windowId}: Not found, not tracked, or already minimized.`);
        return;
    }

    const windowElement = windowData.windowElement;
    const iconRect = getIconPosition(windowId);

    if (!iconRect) {
        console.warn(`Minimize animation skipped: Dock icon not found for ${windowId}. Hiding directly.`);
        windowElement.style.display = 'none';
        windowData.isMinimized = true;
        windowData.wasFullscreen = windowElement.classList.contains('fullscreen');
        if (windowData.wasFullscreen) {
            adjustDockAndTopBarVisibility();
        }
        windowElement.classList.remove('fullscreen');
        return;
    }

    windowData.isMinimized = true;
    windowData.wasFullscreen = windowElement.classList.contains('fullscreen');
    storeLastPosition(windowElement);

    const windowRect = windowElement.getBoundingClientRect();
    const scaleX = Math.max(0.01, iconRect.width / windowRect.width);
    const scaleY = Math.max(0.01, iconRect.height / windowRect.height);
    const translateX = iconRect.left - windowRect.left;
    const translateY = iconRect.top - windowRect.top;
    const originXPercent = ((iconRect.left + iconRect.width / 2) - windowRect.left) / windowRect.width * 100;
    const originYPercent = ((iconRect.top + iconRect.height / 2) - windowRect.top) / windowRect.height * 100;
    windowElement.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;

    windowElement.classList.add('minimizing');
    requestAnimationFrame(() => {
        windowElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        windowElement.style.opacity = '0';
    });

    const animationDuration = 350;
    setTimeout(() => {
        windowElement.style.display = 'none';
        windowElement.classList.remove('minimizing');
        windowElement.style.opacity = '1';
        windowElement.style.transform = 'none';
        windowElement.style.transformOrigin = '50% 50%';
        console.log(`${windowId} minimized (animation complete)`);
        if (windowData.wasFullscreen) {
            adjustDockAndTopBarVisibility();
        }
         windowElement.classList.remove('fullscreen');
    }, animationDuration);
}

// --- NEW toggleFullscreen Function ---
function toggleFullscreen(windowId) {
    const windowData = openWindows[windowId];
    if (!windowData || !windowData.windowElement) {
        console.warn(`Cannot toggle fullscreen for ${windowId}: Not found or not tracked.`);
        return;
    }
    const windowElement = windowData.windowElement;

    if (!windowElement.classList.contains('fullscreen')) {
        storeLastPosition(windowElement);
    }

    windowElement.classList.toggle('fullscreen');
    windowData.wasFullscreen = windowElement.classList.contains('fullscreen');

    const resizeHandles = windowElement.querySelectorAll('.resize-handle');
    if (windowElement.classList.contains('fullscreen')) {
        resizeHandles.forEach(handle => handle.style.display = 'none');
        if (dockElement) dockElement.style.transform = 'translateY(100px)';
        if (topBarElement) topBarElement.classList.add('hidden');
        windowElement.style.transform = 'none';
        windowElement.style.top = '24px';
        windowElement.style.left = '0';
        windowElement.style.width = '100%';
        windowElement.style.height = 'calc(100% - 24px)';
    } else {
        resizeHandles.forEach(handle => handle.style.display = 'block');
        restoreLastPosition(windowElement);
        adjustDockAndTopBarVisibility();
    }
    windowData.isMinimized = false;
    bringToFront(windowElement);
}

 // --- NEW Helper to adjust Dock/Top Bar visibility ---
 function adjustDockAndTopBarVisibility() {
     let visibleFullscreenCount = 0;
     document.querySelectorAll('.window.fullscreen').forEach(win => {
         const id = win.id;
         if (openWindows[id]?.windowElement && !openWindows[id].isMinimized && win.style.display !== 'none') {
             visibleFullscreenCount++;
         }
     });
     console.log("Visible fullscreen windows check:", visibleFullscreenCount);
     if (visibleFullscreenCount === 0) {
         if (dockElement) dockElement.style.transform = 'translateY(0)';
         if (topBarElement) topBarElement.classList.remove('hidden');
     } else {
          if (dockElement) dockElement.style.transform = 'translateY(100px)';
          if (topBarElement) topBarElement.classList.add('hidden');
     }
 }

document.addEventListener('DOMContentLoaded', function() {
    // Initial loading sequence
    const loadingScreen = document.getElementById('loading-screen');
    const lockScreen = document.getElementById('lock-screen');
    const homeScreen = document.getElementById('home-screen');
    
    console.log("DOM Loaded. Setting up loading transition..."); // Log 1

    // Start loading animation
    setTimeout(() => {
        console.log("3000ms timeout reached. Fading out loading screen..."); // Log 2
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            console.log("800ms timeout reached (after fade). Hiding loading, showing lock..."); // Log 3
            loadingScreen.style.display = 'none';
            lockScreen.style.display = 'flex';
            setTimeout(() => {
                console.log("100ms timeout reached (after display change). Fading in lock screen..."); // Log 4
                lockScreen.style.opacity = '1';
                // Start automatic password animation after lock screen is visible
                setTimeout(() => {
                    console.log("1500ms timeout reached (after fade in). Starting password input..."); // Log 5
                    autoInputPassword();
                }, 1500);
            }, 100);
        }, 800);
    }, 3000);
    
    // Lock Screen Password Simulation
    const passwordField = document.querySelector('.password-field');
    const passwordDots = document.querySelector('.password-dots');
    let dots = [];
    let password = '';
    const correctPassword = '1234'; // Example password, normally should be checked securely
    
    // Automatic password input animation
    function autoInputPassword() {
        // Create a typing effect for password dots
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex < correctPassword.length) {
                // Add a dot for each character in the password
                const dot = document.createElement('div');
                dot.classList.add('dot');
                passwordDots.appendChild(dot);
                dots.push(dot);
                password += correctPassword[currentIndex];
                currentIndex++;
                
                // Play a subtle typing sound if needed here
                
            } else {
                clearInterval(typingInterval);
                // Show success animation and unlock
                setTimeout(() => {
                    // Change login hint to "Unlocking..."
                    const loginHint = document.querySelector('.login-hint');
                    if (loginHint) {
                        loginHint.textContent = "Unlocking...";
                    }
                    
                    // Unlock after showing success
                    setTimeout(unlockToHomeScreen, 800);
                }, 300);
            }
        }, 300); // Time between each dot appearing
    }
    
    document.addEventListener('keydown', function(e) {
        // Disable manual password entry if automatic is in progress
        if (lockScreen.style.opacity !== '1' || dots.length > 0) return;
        
        if (e.key >= '0' && e.key <= '9') {
            if (password.length < 6) { // Limit password length
                password += e.key;
                const dot = document.createElement('div');
                dot.classList.add('dot');
                passwordDots.appendChild(dot);
                dots.push(dot);
            }
        } else if (e.key === 'Backspace') {
            if (dots.length > 0) {
                const lastDot = dots.pop();
                passwordDots.removeChild(lastDot);
                password = password.slice(0, -1);
            }
        } else if (e.key === 'Enter') {
            if (password === correctPassword) {
                unlockToHomeScreen();
            } else {
                // Shake animation for wrong password
                passwordField.classList.add('shake');
                setTimeout(() => {
                    passwordField.classList.remove('shake');
                }, 500);
                
                // Clear password field
                passwordDots.innerHTML = '';
                dots = [];
                password = '';
            }
        }
    });
    
    function unlockToHomeScreen() {
        lockScreen.style.opacity = '0';
        setTimeout(() => {
            lockScreen.style.display = 'none';
            homeScreen.style.display = 'flex';
            setTimeout(() => {
                homeScreen.style.opacity = '1';
                // Initialize desktop elements once visible
                initializeDesktop();
            }, 100);
        }, 500);
    }
    
    // Dynamic time display
    function updateTime() {
        const now = new Date();
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).replace(/\s/g, '');
        }
        
        // Update date-time on lock screen as well
        const dateTimeElement = document.querySelector('.date-time');
        if (dateTimeElement) {
            const options = { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        }
        
        setTimeout(updateTime, 1000);
    }
    
    // Initialize time display immediately
    updateTime();
    
    // Initialize desktop environment
    function initializeDesktop() {
        // Get current time and update the clock
        updateClock();
        setInterval(updateClock, 60000); // Update every minute
        
        // Initialize macOS dock animation
        initializeDock();
        
        // Other desktop initialization functions can go here
        initializeWindows();
        initializeMenu();
        initializeSocialWindows();
    }
    
    // Update clock in the status bar
    function updateClock() {
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            timeDisplay.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;
        }
    }
    
    // Initialize the dock animation
    function initializeDock() {
        console.log("Initializing Dock - No static icons added by default.");

        // Add tooltip dynamically to the static Launchpad icon
        const launchpadIcon = document.getElementById('launchpad-dock-icon');
        console.log("Found launchpadIcon element:", launchpadIcon);

        if (launchpadIcon) {
            const tooltip = document.createElement('div');
            tooltip.className = 'dock-tooltip';
            tooltip.textContent = 'Launchpad';
            console.log("Created tooltip element:", tooltip);
            launchpadIcon.appendChild(tooltip);
            console.log("Dynamically added tooltip to Launchpad icon.");

            // Add the 'added' class to make overflow visible
            launchpadIcon.classList.add('added'); 
            console.log("Added '.added' class to Launchpad icon.");

            // Add JS hover listeners specifically for Launchpad tooltip
            launchpadIcon.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            launchpadIcon.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                // Use timeout to allow fade-out before hiding
                setTimeout(() => {
                    if (tooltip.style.opacity === '0') { 
                        tooltip.style.visibility = 'hidden';
                    }
                }, 200); // Match CSS transition duration
            });

            // Add non-functional click listener to static Trash icon
            const trashIcon = document.getElementById('trash-dock-icon');
            if (trashIcon) {
                trashIcon.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent any default browser action
                    console.log('Trash icon clicked - no action defined.');
                    // Currently does nothing else
                });
                console.log("Added inactive click listener to Trash icon.");
            } else {
                console.warn("Trash icon not found, could not add click listener.");
            }

        } else {
            console.warn("Launchpad icon not found, could not add tooltip.");
        }
    }
    
    // --- Global state for dragging and resizing ---
    let currentDragging = null;
    let currentDragData = {};
    let currentResizingWindow = null; // Renamed from currentResizing for clarity
    let currentResizeData = {};

    // --- Global Mouse Move Handler (Dragging & Resizing) ---
    document.addEventListener('mousemove', function(e) {
        // Handle window dragging
        if (currentDragging) {
            const dx = e.clientX - currentDragData.startX;
            const dy = e.clientY - currentDragData.startY;
            currentDragging.style.left = `${currentDragData.startLeft + dx}px`;
            currentDragging.style.top = `${currentDragData.startTop + dy}px`;
        }

        // Handle window resizing
        if (currentResizingWindow) {
            const dx = e.clientX - currentResizeData.startX;
            const dy = e.clientY - currentResizeData.startY;
            const position = currentResizeData.position;
            const window = currentResizingWindow; // Use the global variable

            // Minimum dimensions
            const minWidth = parseInt(window.style.minWidth) || 400;
            const minHeight = parseInt(window.style.minHeight) || 300;

            // Apply resizing based on handle position
            if (position.includes('right')) {
                const newWidth = currentResizeData.startWidth + dx;
                if (newWidth >= minWidth) {
                    window.style.width = `${newWidth}px`;
                }
            }
            if (position.includes('bottom')) {
                const newHeight = currentResizeData.startHeight + dy;
                if (newHeight >= minHeight) {
                    window.style.height = `${newHeight}px`;
                }
            }
            if (position.includes('left')) {
                const newWidth = currentResizeData.startWidth - dx;
                if (newWidth >= minWidth) {
                    window.style.width = `${newWidth}px`;
                    window.style.left = `${currentResizeData.startLeft + dx}px`;
                }
            }
            if (position.includes('top')) {
                const newHeight = currentResizeData.startHeight - dy;
                if (newHeight >= minHeight) {
                    window.style.height = `${newHeight}px`;
                    window.style.top = `${currentResizeData.startTop + dy}px`;
                }
            }
        }
    });

    // --- Global Mouse Up Handler (Dragging & Resizing) ---
    document.addEventListener('mouseup', function() {
        if (currentResizingWindow) {
            document.body.style.cursor = 'auto';
            currentResizingWindow = null; // Clear the global variable
        }
        if (currentDragging) {
            // Don't remove 'dragging' class here if it affects styles elsewhere,
            // let the specific mousedown handler manage that if needed.
            currentDragging = null;
        }
    });

    // Initialize window behaviors (dragging, etc.)
    function initializeWindows() {
        const windows = document.querySelectorAll('.window');
        // Define defaults for static windows here
        const windowDefaults = {
            'setup-window': { width: '600px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            'window-contact': { width: '500px', height: '550px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        };
        // Expose defaults globally for restoreLastPosition
        window.windowDefaults = windowDefaults; 
    
        console.log(`[initializeWindows] Found ${windows.length} potential window elements.`);
        windows.forEach(window => {
            const windowId = window.id;
            if (windowId) {
                 // Only register static windows here. Dynamic windows (socials) are handled by createSocialWindow.
                 // Check if it's a known static window ID
                 if (windowId === 'setup-window' || windowId === 'window-contact') {
                    // Ensure basic tracking exists, but DO NOT create dock icon or show window here.
                    if (!openWindows[windowId]) {
                        openWindows[windowId] = { windowElement: window, dockIconElement: null, isMinimized: false };
                        console.log(`[initializeWindows] Registered static window: ${windowId} (will remain hidden initially).`);
                    } else {
                        // Ensure existing tracking is linked to the DOM element
                        openWindows[windowId].windowElement = window;
                    }

                    // Ensure static windows start hidden (redundant if CSS is correct, but safe)
                    window.style.display = 'none'; 

                    // --- Add Control Listeners --- 
                    // (Keep the code to add close, minimize, maximize, drag listeners)
                    const controls = {
                        close: window.querySelector('.control.close'),
                        minimize: window.querySelector('.control.minimize'),
                        maximize: window.querySelector('.control.maximize'),
                        header: window.querySelector('.window-header')
                    };

                    if (!controls.close || !controls.minimize || !controls.maximize || !controls.header) {
                        console.error(`[initializeWindows] Window controls not found for ${windowId}`);
                        return; 
                    }

                    addResizeHandles(window); 

                    controls.close.addEventListener('click', () => closeWindow(windowId));
                    controls.minimize.addEventListener('click', () => minimizeWindow(windowId));
                    controls.maximize.addEventListener('click', () => toggleFullscreen(windowId));
                    controls.header.addEventListener('mousedown', (e) => {
                        const windowElement = window; 
                        if (windowElement.classList.contains('fullscreen') || windowElement.classList.contains('minimizing')) return;
                        currentDragging = windowElement;
                        currentDragData = {
                            startX: e.clientX, startY: e.clientY,
                            startLeft: windowElement.offsetLeft, startTop: windowElement.offsetTop
                        };
                        storeLastPosition(windowElement); 
                        bringToFront(windowElement);
                        e.preventDefault(); e.stopPropagation();
                    });
                 } else {
                     console.log(`[initializeWindows] Skipping initialization for non-static/unknown window ID: ${windowId}`);
                 }
            } else {
                console.warn("[initializeWindows] Found a .window element without an ID.");
            }
        });
         console.log("[initializeWindows] Finished initializing static windows.");
    }

    // --- Ensure openWindow handles icon creation correctly for static windows --- 
    function openWindow(windowId, appName, iconClassString, url = null) {
        // ... (Keep the beginning logs and checks) ...
        console.log(`[openWindow START] ID=${windowId}, Name=${appName}, HasURL=${!!url}, IconClass=${iconClassString}`); // Log IconClass
        const existingWindow = document.getElementById(windowId);
        console.log(` -> [openWindow] Found existing element by ID?`, existingWindow ? 'YES' : 'NO', existingWindow);
        let windowData = openWindows[windowId]; 
        console.log(` -> [openWindow] Found tracking data?`, windowData ? 'YES' : 'NO', windowData);

        if (existingWindow && !windowData) {
            console.log(` -> [openWindow] Static window element exists but not tracked by initializeWindows? Registering.`);
            openWindows[windowId] = { windowElement: existingWindow, dockIconElement: null, isMinimized: false };
            windowData = openWindows[windowId]; 
        }
        
        // Case 1: Already open 
        if (windowData && windowData.windowElement && !windowData.isMinimized && windowData.windowElement.style.display !== 'none') {
            console.log(` -> [openWindow] Entering Case 1: Already open.`);
           // ... (bringToFront, bounce icon) ...
            bringToFront(windowData.windowElement);
            if (windowData.dockIconElement) {
                windowData.dockIconElement.classList.add('bounce');
                setTimeout(() => windowData.dockIconElement?.classList.remove('bounce'), 500);
            }
        // Case 2: Minimized
        } else if (windowData && windowData.isMinimized) {
            console.log(` -> [openWindow] Entering Case 2: Minimized.`);
            handleDockIconClick(windowId); 
        // Case 3: Exists, hidden
        } else if (existingWindow) { 
            console.log(` -> [openWindow] Entering Case 3: Exists, hidden. Opening.`);
            windowData = openWindows[windowId]; 
            if (!windowData) { 
                console.error(` -> [openWindow] ERROR: Tracking data missing for existing static window ${windowId}!`);
                 openWindows[windowId] = { windowElement: existingWindow, dockIconElement: null, isMinimized: false };
                 windowData = openWindows[windowId]; 
            }
            
            // Ensure dock icon exists (CREATE it here if it doesn't)
            if (!windowData.dockIconElement) {
                console.log(` -> [openWindow] Creating Dock Icon for first open: ${windowId}`);
                let finalIconClass = iconClassString; // Use passed class string
                // Determine appropriate fallback icon class if needed
                if (!finalIconClass) {
                     if (windowId === 'setup-window') finalIconClass = 'fas fa-cogs';
                     else if (windowId === 'window-contact') finalIconClass = 'fas fa-envelope';
                     else finalIconClass = 'fas fa-window-maximize'; // Generic fallback class
                }
                // Call manageDockIcon with the class string
                manageDockIcon(windowId, appName, finalIconClass, false); 
                
                const newIcon = dockElement.querySelector(`.dock-icon[data-app-id="${windowId}"]`);
                if (newIcon) {
                     windowData.dockIconElement = newIcon;
                     console.log(` -> [openWindow] Successfully created and linked dock icon for ${windowId}`);
                     newIcon.classList.add('running'); 
                } else {
                     console.error(` -> [openWindow] Failed to find newly created dock icon for ${windowId}`);
                }
            } else {
                 windowData.dockIconElement.classList.add('running');
            }

            // Restore position/size, show, and bring to front
            console.log(` -> [openWindow] Calling restoreLastPosition for ${windowId}`);
            restoreLastPosition(existingWindow);
            console.log(` -> [openWindow] Setting display=block for ${windowId}`);
            existingWindow.style.display = 'block';
            existingWindow.style.opacity = '1'; 
            windowData.isMinimized = false; 
            console.log(` -> [openWindow] Calling bringToFront for ${windowId}`);
            bringToFront(existingWindow);
            if (windowData.dockIconElement) { 
               console.log(` -> [openWindow] Bouncing dock icon for ${windowId}`);
               windowData.dockIconElement.classList.add('bounce');
               setTimeout(() => windowData.dockIconElement?.classList.remove('bounce'), 500);
           }
        // Case 4: Dynamic creation
        } else if (url) {
            console.log(` -> [openWindow] Entering Case 4: Needs dynamic creation.`);
            if (typeof createSocialWindow === 'function') {
                 // Pass the determined icon class string down
                createSocialWindow(appName, url, iconClassString); 
            } else {
                console.error('createSocialWindow function is not defined!');
            }
        // Case 5: Error
        } else {
            console.log(` -> [openWindow] Entering Case 5: ERROR - Window ID ${windowId} not found and no URL.`);
            console.error(` -> [openWindow] Case 5: ERROR - Window ID ${windowId} not found in DOM and no URL provided.`);
        }
        console.log(`[openWindow END] ID=${windowId}`); 
    }

    // Function to create and manage custom social media windows
    function initializeSocialWindows() {
        const desktop = document.querySelector('.desktop');
        const socialLinks = document.querySelectorAll('.socials-menu .dropdown-menu a');
        
        // Add click handlers to social links
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const socialUrl = this.getAttribute('href');
                const socialName = this.textContent;
                const windowId = `window-${socialName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

                if (openWindows[windowId]) {
                    handleDockIconClick(windowId);
                } else {
                    const iconClass = getSocialIconClass(socialName);
                    createSocialWindow(socialName, socialUrl, iconClass);
                }
            });
        });
    }

    // --- Define getSocialIconClass here (accessible within DOMContentLoaded) ---
    function getSocialIconClass(socialName) {
        const nameToClass = {
            'Instagram': 'fab fa-instagram',
            'TikTok': 'fab fa-tiktok',
            'Discord': 'fab fa-discord',
            'Twitch': 'fab fa-twitch',
            'YouTube': 'fab fa-youtube',
            'Snapchat': 'fab fa-snapchat',
            'Twitter': 'fab fa-twitter',
            'Facebook': 'fab fa-facebook'
        };
        return nameToClass[socialName] || 'fas fa-globe';
    }

    // --- Update createSocialWindow (Adjust initial styling and bringToFront timing) ---
    function createSocialWindow(title, url, iconClassString) { // Changed iconClass to iconClassString
        const windowId = `window-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const desktop = document.querySelector('.desktop');

        if (document.getElementById(windowId) || (openWindows[windowId] && openWindows[windowId].windowElement)) {
            console.log(`createSocialWindow redundant call for existing window: ${windowId}. Focusing.`);
            handleDockIconClick(windowId);
            return;
        }
        console.log(`[createSocialWindow] Creating for ${title} (ID: ${windowId}), IconClass=${iconClassString}`); // Log IconClass

        // --- Create Elements ---
        const socialWindow = document.createElement('div');
        socialWindow.className = 'window dynamic-window';
        socialWindow.id = windowId;
        const header = document.createElement('div');
        header.className = 'window-header';
        const controls = document.createElement('div');
        controls.className = 'window-controls';
        const closeBtn = document.createElement('div');
        closeBtn.className = 'control close';
        const minimizeBtn = document.createElement('div');
        minimizeBtn.className = 'control minimize';
        const maximizeBtn = document.createElement('div');
        maximizeBtn.className = 'control maximize';
        controls.appendChild(closeBtn);
        controls.appendChild(minimizeBtn);
        controls.appendChild(maximizeBtn);
        const windowTitle = document.createElement('div');
        windowTitle.className = 'window-title';
        const titleWithIcon = document.createElement('div');
        titleWithIcon.className = 'title-with-icon';
        const icon = document.createElement('i');
        // Use the passed class string directly
        icon.className = iconClassString ? iconClassString : 'fas fa-globe'; 
        const titleText = document.createElement('span');
        titleText.textContent = title;
        titleWithIcon.appendChild(icon);
        titleWithIcon.appendChild(titleText);
        windowTitle.appendChild(titleWithIcon);
        header.appendChild(controls);
        header.appendChild(windowTitle);
        const content = document.createElement('div');
        content.className = 'window-content';
        content.style.position = 'relative';
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i><p>Loading...</p>';
        const iframe = document.createElement('iframe');
        iframe.className = 'social-iframe';
        iframe.style.cssText = 'width:100%; height:100%; border:none; opacity:0; position:relative; z-index:1; background-color: #fff; transition: opacity 0.3s ease;';
        iframe.onload = () => { loadingSpinner.style.display = 'none'; iframe.style.opacity = '1'; };
        iframe.onerror = () => { loadingSpinner.innerHTML = '<p style="color: red;">Failed to load content.</p>'; };
        iframe.src = url;
        content.appendChild(loadingSpinner);
        content.appendChild(iframe);
        socialWindow.appendChild(header);
        socialWindow.appendChild(content);

        // --- Style Setup & Add to DOM ---
        socialWindow.style.minWidth = '400px';
        socialWindow.style.minHeight = '300px';
        const defaultWidth = 800;
        const defaultHeight = 600;
        socialWindow.style.width = `${defaultWidth}px`;
        socialWindow.style.height = `${defaultHeight}px`;
        const initialTop = Math.max(24, (window.innerHeight / 2) - (defaultHeight / 2)); 
        const initialLeft = Math.max(0, (window.innerWidth / 2) - (defaultWidth / 2));
        socialWindow.style.top = `${initialTop}px`;
        socialWindow.style.left = `${initialLeft}px`;
        socialWindow.style.transform = 'none'; 
        socialWindow.style.opacity = '1'; 
        socialWindow.style.display = 'block'; 
        if (desktop) {
            desktop.appendChild(socialWindow);
            socialWindow.offsetHeight;
        } else { console.error("Desktop element not found."); return; }

        // --- Create Dock Icon & Tracking ---
        console.log(` -> [createSocialWindow] Calling manageDockIcon for ${windowId}`);
        manageDockIcon(windowId, title, iconClassString, false);

        if (!openWindows[windowId]) {
            console.error(` -> [createSocialWindow] ERROR: Tracking data still missing for ${windowId} after manageDockIcon call!`);
            openWindows[windowId] = { windowElement: socialWindow, dockIconElement: null, isMinimized: false };
        }
        openWindows[windowId].windowElement = socialWindow;
        if (!openWindows[windowId].dockIconElement) {
            const newIcon = dockElement.querySelector(`.dock-icon[data-app-id="${windowId}"]`);
            if (newIcon) openWindows[windowId].dockIconElement = newIcon;
            else console.error(` -> [createSocialWindow] Failed to find/link dock icon for ${windowId}`);
        }
        
        addResizeHandles(socialWindow);

        // --- Add Event Listeners ---
        closeBtn.addEventListener('click', () => closeWindow(windowId));
        minimizeBtn.addEventListener('click', () => minimizeWindow(windowId));
        maximizeBtn.addEventListener('click', () => toggleFullscreen(windowId));
        header.addEventListener('mousedown', (e) => {
             if (socialWindow.classList.contains('fullscreen') || socialWindow.classList.contains('minimizing')) return;
             currentDragging = socialWindow;
             currentDragData = { startX: e.clientX, startY: e.clientY, startLeft: socialWindow.offsetLeft, startTop: socialWindow.offsetTop };
             storeLastPosition(socialWindow);
             bringToFront(socialWindow);
             e.preventDefault(); e.stopPropagation();
        });

        // --- Final Step: Bring to Front ---
        setTimeout(() => {
             console.log(`[createSocialWindow] Calling bringToFront for ${windowId} after timeout.`);
             bringToFront(socialWindow);
             console.log(`[createSocialWindow] Finished creating ${windowId}`);
        }, 0);
    }

    // Top menu functionality
    function initializeMenu() {
        console.log("[initializeMenu] Initializing menu (v4)..."); 
        const menuItems = document.querySelectorAll('.top-bar .menu-item');
        const dropdownItems = document.querySelectorAll('.top-bar .dropdown-item');

        console.log(`[initializeMenu] Found ${menuItems.length} menu items to process.`);
        menuItems.forEach((item, index) => {
            const itemText = item.childNodes[0]?.textContent.trim(); 
            console.log(`[initializeMenu] Processing menu item ${index}: "${itemText}"`, item);
            const dropdown = item.querySelector('.dropdown-menu');
            
            if (dropdown) {
                console.log(` -> [initializeMenu] Found dropdown for "${itemText}". Adding click listener.`);
                 item.addEventListener('click', (event) => {
                     console.log(`[Menu Item Click] Click detected on "${itemText}" wrapper div.`);
                     if (event.target.closest('.dropdown-menu')) {
                        console.log(` -> [Menu Item Click] Click was inside the dropdown for "${itemText}", ignoring toggle.`);
                         return; 
                     }
                     event.preventDefault(); 
                     event.stopPropagation(); 
                     console.log(` -> [Menu Item Click] Toggling dropdown for "${itemText}".`);
                     const isActive = dropdown.classList.contains('active');
                     document.querySelectorAll('.dropdown-menu.active').forEach(d => { 
                         if (d !== dropdown) { 
                             console.log(` -> [Menu Item Click] Closing other active dropdown.`);
                             d.classList.remove('active'); 
                         }
                     });
                     dropdown.classList.toggle('active');
                     console.log(` -> [Menu Item Click] Dropdown for "${itemText}" is now ${dropdown.classList.contains('active') ? 'active' : 'inactive'}.`);
                 });
            } else {
                console.log(` -> [initializeMenu] No dropdown found for "${itemText}".`);
            }
        });

        dropdownItems.forEach(item => {
             item.addEventListener('click', (event) => {
                    event.preventDefault();
                    const windowId = item.getAttribute('data-app-id');
                    const url = item.getAttribute('href');
                    const isDisabled = item.classList.contains('disabled');

                    console.log(`[Dropdown Item Click] Item: "${item.textContent.trim()}", ID: ${windowId}, URL: ${url}, Disabled: ${isDisabled}`);

                    if (isDisabled) return;

                    const parentDropdown = item.closest('.dropdown-menu');
                    if (parentDropdown) parentDropdown.classList.remove('active');

                    if (windowId) {
                        let appName = item.textContent.trim();
                        let iconClassString = null; // Changed from iconHtml
                        const isSocial = windowId.startsWith('window-') && windowId !== 'window-contact' && windowId !== 'setup-window';

                        // Determine Icon CLASS STRING
                        if (windowId === 'setup-window') {
                            iconClassString = 'fas fa-cogs';
                        } else if (windowId === 'window-contact') {
                            iconClassString = 'fas fa-envelope';
                             console.log(`[Dropdown Item Click] Contact item detected. Preparing to call openWindow...`);
                        } else if (isSocial) {
                            iconClassString = getSocialIconClass(appName); // Returns class string like "fab fa-instagram"
                        }
                        // Fallback class string
                        if (!iconClassString) {
                             iconClassString = 'fas fa-window-maximize';
                             console.warn(`[Dropdown Item Click] Could not determine specific icon class for ${windowId}, using fallback.`);
                        }

                        // Pass the CLASS STRING to openWindow
                        console.log(`[Dropdown Item Click] Calling openWindow for ID=${windowId}, Name=${appName}, IconClass=${iconClassString}, URL=${isSocial ? url : null}`);
                        openWindow(windowId, appName, iconClassString, isSocial ? url : null);
                        
                        if (windowId === 'window-contact') {
                           console.log(`[Dropdown Item Click] openWindow call completed for Contact.`);
                        } 
                         
                    } else if (url && url !== '#') {
                         console.log(`[Dropdown Item Click] Opening external link: ${url}`);
                         window.open(url, '_blank');
                     }
                });
        });

         // Close dropdowns if clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.top-bar .menu-item')) {
                document.querySelectorAll('.dropdown-menu.active').forEach(dropdown => dropdown.classList.remove('active'));
            }
        });

        console.log("[initializeMenu] Menu initialized (v4).");
    }

    // Assign dock elements now that DOM is loaded
    dockElement = document.querySelector('.dock');
    dockDivider = document.querySelector('.dock-divider');
    topBarElement = document.querySelector('.top-bar');

    const launchpadOverlay = document.getElementById('launchpad-overlay');
    const launchpadGrid = document.querySelector('.launchpad-grid');
    const launchpadDockIcon = document.getElementById('launchpad-dock-icon');

    // --- Function to Populate Launchpad Grid ---
    function populateLaunchpadGrid() {
        if (!launchpadGrid) return;
        launchpadGrid.innerHTML = ''; // Clear existing icons

        launchpadApps.forEach(app => {
            const item = document.createElement('a'); // Use <a> for semantics, prevent default later
            item.className = 'launchpad-item';
            item.href = '#'; // Placeholder href
            item.setAttribute('data-app-id', app.id);

            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-container';
            // Set background using helper function
            iconContainer.style.background = getAppBackgroundStyle(app.name);
            
            const icon = document.createElement('i');
            icon.className = app.iconClass || 'fas fa-window-maximize'; // Use defined class or fallback
            iconContainer.appendChild(icon);
            
            const label = document.createElement('span');
            label.textContent = app.name;

            item.appendChild(iconContainer);
            item.appendChild(label);

            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent anchor link behavior
                openAppFromLaunchpad(app);
            });

            launchpadGrid.appendChild(item);
        });
    }

    // --- Function to Open App from Launchpad Item ---
    function openAppFromLaunchpad(appData) {
        console.log(`Launchpad clicked:`, appData);
        // Close Launchpad first
        if (launchpadOverlay) launchpadOverlay.classList.remove('active');
        // Optional: Show dock again when launchpad closes
        if (dockElement) dockElement.style.transform = 'translateY(0)';

        // --- Add Delay --- 
        setTimeout(() => {
            console.log(` -> Opening/focusing app ${appData.id} after delay.`);
            const windowId = appData.id;

            // Case 1: Dynamic Window (Needs Creation?)
            if (appData.url && !openWindows[windowId]) {
                console.log(` -> App ${windowId} needs dynamic creation.`);
                if (typeof createSocialWindow !== 'function') {
                    console.error("createSocialWindow function not found!");
                    return;
                }
                if (typeof getSocialIconClass !== 'function') {
                     console.error("getSocialIconClass function not found!");
                     // Define fallback only if truly missing
                      window.getSocialIconClass = window.getSocialIconClass || function(socialName) { 
                         const nameToClass = { 'Instagram': 'fab fa-instagram', 'TikTok': 'fab fa-tiktok', 'Discord': 'fab fa-discord', 'Twitch': 'fab fa-twitch', 'YouTube': 'fab fa-youtube', 'Snapchat': 'fab fa-snapchat', 'Twitter': 'fab fa-twitter', 'Facebook': 'fab fa-facebook' };
                         return nameToClass[socialName] || 'fas fa-globe';
                     }
                }
                createSocialWindow(appData.name, appData.url, getSocialIconClass(appData.name));
            // Case 2: Existing Window (Static or Dynamic)
            } else if (openWindows[windowId]) {
                 console.log(` -> App ${windowId} exists. Calling handleDockIconClick.`);
                 handleDockIconClick(windowId);
            // Case 3: Fallback for potentially untracked static window
            } else {
                 console.warn(` -> App ${windowId} not tracked...`);
                 const staticWindow = document.getElementById(windowId);
                 if (staticWindow) {
                      console.log(` -> Fallback found element ${windowId}. Showing and bringing to front.`);
                      staticWindow.style.display = 'block';
                      staticWindow.classList.add('active');
                      bringToFront(staticWindow);
                      // Ensure dock icon exists if it wasn't created properly
                      if (!openWindows[windowId] || !openWindows[windowId].dockIconElement) {
                         console.log(` -> Fallback creating/managing dock icon for ${windowId}.`);
                         // USE CORRECT ICON: Pass the iconClass from appData
                         let iconClassFallback = appData.iconClass ? appData.iconClass : 'fas fa-globe'; // Fallback if no class
                         manageDockIcon(windowId, appData.name, iconClassFallback, false);
                         // Link the element now AFTER manageDockIcon initializes tracking
                          if(openWindows[windowId]) {
                             openWindows[windowId].windowElement = staticWindow;
                          } else {
                             console.error("Failed to link window element after fallback dock creation for", windowId);
                          }
                     } else {
                        // ADD: Ensure window element is linked even if dock icon already existed
                        if (openWindows[windowId] && !openWindows[windowId].windowElement) {
                             openWindows[windowId].windowElement = staticWindow;
                             console.log(" -> Linked existing window element in fallback for", windowId);
                        }
                     }
                 } else {
                      console.error(` -> Fallback failed. Element with ID ${windowId} not found.`);
                 }
            }
        }, 50); // 50ms delay - adjust if needed
        // --- End Delay Wrapper ---
    }

    // --- Launchpad Event Listeners ---
    if (launchpadDockIcon) {
        launchpadDockIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering potential body click listener
            populateLaunchpadGrid(); // Refresh grid content
            launchpadOverlay.classList.add('active');
             // Optional: Hide dock when launchpad is active
             if (dockElement) dockElement.style.transform = 'translateY(100px)';
        });
    }

    if (launchpadOverlay) {
        launchpadOverlay.addEventListener('click', (e) => {
            // Close if clicking directly on the overlay background, not an item inside
            if (e.target === launchpadOverlay) {
                launchpadOverlay.classList.remove('active');
                 // Optional: Show dock again
                 if (dockElement) dockElement.style.transform = 'translateY(0)';
            }
        });
    }

    // --- Updated addResizeHandles --- 
    function addResizeHandles(window) {
        // Remove the transform property as it interferes with resizing
        if (window.style.transform === 'translate(-50%, -50%)') {
            window.style.left = `${window.offsetLeft}px`;
            window.style.top = `${window.offsetTop}px`;
            window.style.transform = 'none';
        }
        
        const resizePositions = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        resizePositions.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            // Ensure existing handles are removed before adding new ones if called multiple times
            const existingHandle = window.querySelector(`.resize-handle.${position}`);
            if (existingHandle) existingHandle.remove();
            window.appendChild(handle);
            
            // Set cursor style based on position
            // ... (Keep existing switch case for cursor styles) ...
            switch(position) {
                case 'top': case 'bottom': handle.style.cursor = 'ns-resize'; break;
                case 'left': case 'right': handle.style.cursor = 'ew-resize'; break;
                case 'top-left': case 'bottom-right': handle.style.cursor = 'nwse-resize'; break;
                case 'top-right': case 'bottom-left': handle.style.cursor = 'nesw-resize'; break;
            }

            // Setup resize functionality - Mousedown ONLY
            handle.addEventListener('mousedown', (e) => {
                 if (window.classList.contains('fullscreen')) return;
                 // Set the *global* variables for resizing
                 currentResizingWindow = window; 
                 currentResizeData = {
                     position: position,
                     startX: e.clientX,
                     startY: e.clientY,
                     startWidth: parseInt(window.offsetWidth, 10),
                     startHeight: parseInt(window.offsetHeight, 10),
                     startTop: window.offsetTop,
                     startLeft: window.offsetLeft
                 };
                 
                 document.body.style.cursor = handle.style.cursor; // Set cursor immediately
                 bringToFront(window);
                 e.preventDefault();
                 e.stopPropagation();
            });
        });
    }
});
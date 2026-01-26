'use client';

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MediaItem, MediaAssetUI } from './MediaItem';
import styles from './MediaManager.module.css';

interface SortableItemProps {
    asset: MediaAssetUI;
    onDelete: (id: string) => void;
}

function SortableItem({ asset, onDelete }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: asset.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <MediaItem
                asset={asset}
                onDelete={onDelete}
                dragHandleProps={listeners}
            />
        </div>
    );
}

interface MediaGridProps {
    assets: MediaAssetUI[];
    onReorder: (newAssets: MediaAssetUI[]) => void;
    onDelete: (id: string) => void;
}

export function MediaGrid({ assets, onReorder, onDelete }: MediaGridProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = assets.findIndex((item) => item.id === active.id);
            const newIndex = assets.findIndex((item) => item.id === over.id);
            onReorder(arrayMove(assets, oldIndex, newIndex));
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.grid}>
                <SortableContext
                    items={assets.map(a => a.id)}
                    strategy={rectSortingStrategy}
                >
                    {assets.map((asset) => (
                        <SortableItem key={asset.id} asset={asset} onDelete={onDelete} />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
}

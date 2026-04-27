#ifndef SRC_TRACE_PROCESSOR_TABLES_SLICE_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_SLICE_TABLES_PY_H_

#include <array>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <optional>
#include <tuple>
#include <type_traits>
#include <utility>
#include <variant>
#include <vector>

#include "perfetto/base/compiler.h"
#include "perfetto/base/logging.h"
#include "perfetto/public/compiler.h"
#include "perfetto/trace_processor/basic_types.h"
#include "perfetto/trace_processor/ref_counted.h"
#include "src/trace_processor/dataframe/dataframe.h"
#include "src/trace_processor/dataframe/specs.h"
#include "src/trace_processor/dataframe/typed_cursor.h"
#include "src/trace_processor/tables/macros_internal.h"

#include "src/trace_processor/tables/track_tables_py.h"

namespace perfetto::trace_processor::tables {

class SliceTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","dur","track_id","category","name","depth","stack_id","parent_stack_id","parent_id","arg_set_id","thread_ts","thread_dur","thread_instruction_count","thread_instruction_delta"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SliceTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SliceTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
  };
  struct RowReference {
   public:
    explicit RowReference(SliceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SliceTable::Id id() const {
        
        return SliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> category() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::category>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
        int64_t stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::stack_id>(kSpec, row_);
    }
        int64_t parent_stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, row_);
    }
          std::optional<SliceTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(SliceTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<int64_t> thread_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_ts>(kSpec, row_);
    }
        std::optional<int64_t> thread_dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_dur>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_delta() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, row_);
    }
    void set_dur(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dur>(kSpec, row_, res);
    }
          void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_depth(uint32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::depth>(kSpec, row_, res);
    }
        void set_stack_id(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::stack_id>(kSpec, row_, res);
    }
        void set_parent_stack_id(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, row_, res);
    }
          void set_parent_id(std::optional<SliceTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
        void set_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_thread_ts(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_ts>(kSpec, row_, res);
    }
        void set_thread_dur(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_dur>(kSpec, row_, res);
    }
        void set_thread_instruction_count(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, row_, res);
    }
        void set_thread_instruction_delta(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SliceTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SliceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SliceTable::Id id() const {
        
        return SliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> category() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::category>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
        int64_t stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::stack_id>(kSpec, row_);
    }
        int64_t parent_stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, row_);
    }
          std::optional<SliceTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(SliceTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<int64_t> thread_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_ts>(kSpec, row_);
    }
        std::optional<int64_t> thread_dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_dur>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_delta() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SliceTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SliceTable::Id id() const {
        
        return SliceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t dur() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::dur>(kSpec);
    }
      TrackTable::Id track_id() const {
        
        return TrackTable::Id{cursor_.GetCellUnchecked<ColumnIndex::track_id>(kSpec)};
      }
      std::optional<StringPool::Id> category() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::category>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    uint32_t depth() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::depth>(kSpec);
    }
    int64_t stack_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::stack_id>(kSpec);
    }
    int64_t parent_stack_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec);
    }
      std::optional<SliceTable::Id> parent_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(SliceTable::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<int64_t> thread_ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_ts>(kSpec);
    }
    std::optional<int64_t> thread_dur() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_dur>(kSpec);
    }
    std::optional<int64_t> thread_instruction_count() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec);
    }
    std::optional<int64_t> thread_instruction_delta() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SliceTable::Id id() const {
        
        return SliceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t dur() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::dur>(kSpec);
    }
      TrackTable::Id track_id() const {
        
        return TrackTable::Id{cursor_.GetCellUnchecked<ColumnIndex::track_id>(kSpec)};
      }
      std::optional<StringPool::Id> category() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::category>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    uint32_t depth() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::depth>(kSpec);
    }
    int64_t stack_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::stack_id>(kSpec);
    }
    int64_t parent_stack_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec);
    }
      std::optional<SliceTable::Id> parent_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(SliceTable::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<int64_t> thread_ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_ts>(kSpec);
    }
    std::optional<int64_t> thread_dur() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_dur>(kSpec);
    }
    std::optional<int64_t> thread_instruction_count() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec);
    }
    std::optional<int64_t> thread_instruction_delta() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec);
    }
    void set_dur(int64_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::dur>(kSpec, res);
    }
      void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
    void set_depth(uint32_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::depth>(kSpec, res);
    }
    void set_stack_id(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::stack_id>(kSpec, res);
    }
    void set_parent_stack_id(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, res);
    }
      void set_parent_id(std::optional<SliceTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, res_value);
      }
    void set_arg_set_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_thread_ts(std::optional<int64_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::thread_ts>(kSpec, res);
    }
    void set_thread_dur(std::optional<int64_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::thread_dur>(kSpec, res);
    }
    void set_thread_instruction_count(std::optional<int64_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, res);
    }
    void set_thread_instruction_delta(std::optional<int64_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SliceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SliceTable::Id id() const {
        
        return SliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> category() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::category>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
        int64_t stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::stack_id>(kSpec, row_);
    }
        int64_t parent_stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, row_);
    }
          std::optional<SliceTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(SliceTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<int64_t> thread_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_ts>(kSpec, row_);
    }
        std::optional<int64_t> thread_dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_dur>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_delta() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, row_);
    }
      void set_dur(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dur>(kSpec, row_, res);
    }
          void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_depth(uint32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::depth>(kSpec, row_, res);
    }
        void set_stack_id(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::stack_id>(kSpec, row_, res);
    }
        void set_parent_stack_id(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, row_, res);
    }
          void set_parent_id(std::optional<SliceTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
        void set_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_thread_ts(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_ts>(kSpec, row_, res);
    }
        void set_thread_dur(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_dur>(kSpec, row_, res);
    }
        void set_thread_instruction_count(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, row_, res);
    }
        void set_thread_instruction_delta(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, row_, res);
    }

    private:
      SliceTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SliceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SliceTable::Id id() const {
        
        return SliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> category() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::category>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
        int64_t stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::stack_id>(kSpec, row_);
    }
        int64_t parent_stack_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_stack_id>(kSpec, row_);
    }
          std::optional<SliceTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(SliceTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<int64_t> thread_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_ts>(kSpec, row_);
    }
        std::optional<int64_t> thread_dur() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_dur>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_count>(kSpec, row_);
    }
        std::optional<int64_t> thread_instruction_delta() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::thread_instruction_delta>(kSpec, row_);
    }

    private:
      const SliceTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, int64_t _dur = {}, TrackTable::Id _track_id = {}, std::optional<StringPool::Id> _category = {}, std::optional<StringPool::Id> _name = {}, uint32_t _depth = {}, int64_t _stack_id = {}, int64_t _parent_stack_id = {}, std::optional<SliceTable::Id> _parent_id = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<int64_t> _thread_ts = {}, std::optional<int64_t> _thread_dur = {}, std::optional<int64_t> _thread_instruction_count = {}, std::optional<int64_t> _thread_instruction_delta = {}) : ts(std::move(_ts)), dur(std::move(_dur)), track_id(std::move(_track_id)), category(std::move(_category)), name(std::move(_name)), depth(std::move(_depth)), stack_id(std::move(_stack_id)), parent_stack_id(std::move(_parent_stack_id)), parent_id(std::move(_parent_id)), arg_set_id(std::move(_arg_set_id)), thread_ts(std::move(_thread_ts)), thread_dur(std::move(_thread_dur)), thread_instruction_count(std::move(_thread_instruction_count)), thread_instruction_delta(std::move(_thread_instruction_delta)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, dur, track_id, category, name, depth, stack_id, parent_stack_id, parent_id, arg_set_id, thread_ts, thread_dur, thread_instruction_count, thread_instruction_delta) ==
             std::tie(other.ts, other.dur, other.track_id, other.category, other.name, other.depth, other.stack_id, other.parent_stack_id, other.parent_id, other.arg_set_id, other.thread_ts, other.thread_dur, other.thread_instruction_count, other.thread_instruction_delta);
    }

        int64_t ts;
    int64_t dur;
    TrackTable::Id track_id;
    std::optional<StringPool::Id> category;
    std::optional<StringPool::Id> name;
    uint32_t depth;
    int64_t stack_id;
    int64_t parent_stack_id;
    std::optional<SliceTable::Id> parent_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<int64_t> thread_ts;
    std::optional<int64_t> thread_dur;
    std::optional<int64_t> thread_instruction_count;
    std::optional<int64_t> thread_instruction_delta;
  };

  explicit SliceTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.dur, row.track_id.value, row.category && row.category != StringPool::Id::Null() ? std::make_optional(*row.category) : std::nullopt, row.name && row.name != StringPool::Id::Null() ? std::make_optional(*row.name) : std::nullopt, row.depth, row.stack_id, row.parent_stack_id, row.parent_id ? std::make_optional(row.parent_id->value) : std::nullopt, row.arg_set_id, row.thread_ts, row.thread_dur, row.thread_instruction_count, row.thread_instruction_delta);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_slice";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class AndroidNetworkPacketsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","iface","direction","packet_transport","packet_length","packet_count","socket_tag","socket_tag_str","socket_uid","local_port","remote_port","packet_icmp_type","packet_icmp_code","packet_tcp_flags","packet_tcp_flags_str"},
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(AndroidNetworkPacketsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const AndroidNetworkPacketsTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t iface = 1;
    static constexpr uint32_t direction = 2;
    static constexpr uint32_t packet_transport = 3;
    static constexpr uint32_t packet_length = 4;
    static constexpr uint32_t packet_count = 5;
    static constexpr uint32_t socket_tag = 6;
    static constexpr uint32_t socket_tag_str = 7;
    static constexpr uint32_t socket_uid = 8;
    static constexpr uint32_t local_port = 9;
    static constexpr uint32_t remote_port = 10;
    static constexpr uint32_t packet_icmp_type = 11;
    static constexpr uint32_t packet_icmp_code = 12;
    static constexpr uint32_t packet_tcp_flags = 13;
    static constexpr uint32_t packet_tcp_flags_str = 14;
  };
  struct RowReference {
   public:
    explicit RowReference(AndroidNetworkPacketsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    AndroidNetworkPacketsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const AndroidNetworkPacketsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const AndroidNetworkPacketsTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(AndroidNetworkPacketsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      
      

    private:
      AndroidNetworkPacketsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const AndroidNetworkPacketsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      

    private:
      const AndroidNetworkPacketsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(SliceTable::Id _id = {}, StringPool::Id _iface = {}, StringPool::Id _direction = {}, StringPool::Id _packet_transport = {}, int64_t _packet_length = {}, int64_t _packet_count = {}, uint32_t _socket_tag = {}, StringPool::Id _socket_tag_str = {}, uint32_t _socket_uid = {}, std::optional<uint32_t> _local_port = {}, std::optional<uint32_t> _remote_port = {}, std::optional<uint32_t> _packet_icmp_type = {}, std::optional<uint32_t> _packet_icmp_code = {}, std::optional<uint32_t> _packet_tcp_flags = {}, std::optional<StringPool::Id> _packet_tcp_flags_str = {}) : id(std::move(_id)), iface(std::move(_iface)), direction(std::move(_direction)), packet_transport(std::move(_packet_transport)), packet_length(std::move(_packet_length)), packet_count(std::move(_packet_count)), socket_tag(std::move(_socket_tag)), socket_tag_str(std::move(_socket_tag_str)), socket_uid(std::move(_socket_uid)), local_port(std::move(_local_port)), remote_port(std::move(_remote_port)), packet_icmp_type(std::move(_packet_icmp_type)), packet_icmp_code(std::move(_packet_icmp_code)), packet_tcp_flags(std::move(_packet_tcp_flags)), packet_tcp_flags_str(std::move(_packet_tcp_flags_str)) {}

    bool operator==(const Row& other) const {
      return std::tie(id, iface, direction, packet_transport, packet_length, packet_count, socket_tag, socket_tag_str, socket_uid, local_port, remote_port, packet_icmp_type, packet_icmp_code, packet_tcp_flags, packet_tcp_flags_str) ==
             std::tie(other.id, other.iface, other.direction, other.packet_transport, other.packet_length, other.packet_count, other.socket_tag, other.socket_tag_str, other.socket_uid, other.local_port, other.remote_port, other.packet_icmp_type, other.packet_icmp_code, other.packet_tcp_flags, other.packet_tcp_flags_str);
    }

        SliceTable::Id id;
    StringPool::Id iface;
    StringPool::Id direction;
    StringPool::Id packet_transport;
    int64_t packet_length;
    int64_t packet_count;
    uint32_t socket_tag;
    StringPool::Id socket_tag_str;
    uint32_t socket_uid;
    std::optional<uint32_t> local_port;
    std::optional<uint32_t> remote_port;
    std::optional<uint32_t> packet_icmp_type;
    std::optional<uint32_t> packet_icmp_code;
    std::optional<uint32_t> packet_tcp_flags;
    std::optional<StringPool::Id> packet_tcp_flags_str;
  };

  explicit AndroidNetworkPacketsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, row.id.value, row.iface != StringPool::Id::Null() ? std::make_optional(row.iface) : std::nullopt, row.direction != StringPool::Id::Null() ? std::make_optional(row.direction) : std::nullopt, row.packet_transport != StringPool::Id::Null() ? std::make_optional(row.packet_transport) : std::nullopt, row.packet_length, row.packet_count, row.socket_tag, row.socket_tag_str != StringPool::Id::Null() ? std::make_optional(row.socket_tag_str) : std::nullopt, row.socket_uid, row.local_port, row.remote_port, row.packet_icmp_type, row.packet_icmp_code, row.packet_tcp_flags, row.packet_tcp_flags_str && row.packet_tcp_flags_str != StringPool::Id::Null() ? std::make_optional(*row.packet_tcp_flags_str) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_android_network_packets";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class ExperimentalFlatSliceTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","dur","track_id","category","name","arg_set_id","source_id","start_bound","end_bound"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(ExperimentalFlatSliceTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ExperimentalFlatSliceTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t arg_set_id = 6;
    static constexpr uint32_t source_id = 7;
    static constexpr uint32_t start_bound = 8;
    static constexpr uint32_t end_bound = 9;
  };
  struct RowReference {
   public:
    explicit RowReference(ExperimentalFlatSliceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ExperimentalFlatSliceTable::Id id() const {
        
        return ExperimentalFlatSliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
    void set_dur(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dur>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ExperimentalFlatSliceTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ExperimentalFlatSliceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ExperimentalFlatSliceTable::Id id() const {
        
        return ExperimentalFlatSliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ExperimentalFlatSliceTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    ExperimentalFlatSliceTable::Id id() const {
        
        return ExperimentalFlatSliceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t dur() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::dur>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    ExperimentalFlatSliceTable::Id id() const {
        
        return ExperimentalFlatSliceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t dur() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::dur>(kSpec);
    }
    void set_dur(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::dur>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ExperimentalFlatSliceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      ExperimentalFlatSliceTable::Id id() const {
        
        return ExperimentalFlatSliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }
      void set_dur(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dur>(kSpec, row_, res);
    }

    private:
      ExperimentalFlatSliceTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ExperimentalFlatSliceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      ExperimentalFlatSliceTable::Id id() const {
        
        return ExperimentalFlatSliceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t dur() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dur>(kSpec, row_);
    }

    private:
      const ExperimentalFlatSliceTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, int64_t _dur = {}, TrackTable::Id _track_id = {}, std::optional<StringPool::Id> _category = {}, std::optional<StringPool::Id> _name = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<SliceTable::Id> _source_id = {}, int64_t _start_bound = {}, int64_t _end_bound = {}) : ts(std::move(_ts)), dur(std::move(_dur)), track_id(std::move(_track_id)), category(std::move(_category)), name(std::move(_name)), arg_set_id(std::move(_arg_set_id)), source_id(std::move(_source_id)), start_bound(std::move(_start_bound)), end_bound(std::move(_end_bound)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, dur, track_id, category, name, arg_set_id, source_id, start_bound, end_bound) ==
             std::tie(other.ts, other.dur, other.track_id, other.category, other.name, other.arg_set_id, other.source_id, other.start_bound, other.end_bound);
    }

        int64_t ts;
    int64_t dur;
    TrackTable::Id track_id;
    std::optional<StringPool::Id> category;
    std::optional<StringPool::Id> name;
    std::optional<uint32_t> arg_set_id;
    std::optional<SliceTable::Id> source_id;
    int64_t start_bound;
    int64_t end_bound;
  };

  explicit ExperimentalFlatSliceTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.dur, row.track_id.value, row.category && row.category != StringPool::Id::Null() ? std::make_optional(*row.category) : std::nullopt, row.name && row.name != StringPool::Id::Null() ? std::make_optional(*row.name) : std::nullopt, row.arg_set_id, row.source_id ? std::make_optional(row.source_id->value) : std::nullopt, row.start_bound, row.end_bound);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "experimental_flat_slice";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_TABLES_SLICE_TABLES_PY_H_
